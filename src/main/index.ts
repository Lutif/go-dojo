import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join, delimiter, sep } from 'path'
import { execSync, exec } from 'child_process'
import {
  mkdirSync, writeFileSync, existsSync, readFileSync, rmSync,
  readdirSync, renameSync, unlinkSync, statSync
} from 'fs'
import { tmpdir, homedir } from 'os'

let mainWindow: BrowserWindow | null = null

// GUI-launched apps on macOS inherit a minimal PATH that excludes Homebrew and
// /usr/local/go/bin. Augment PATH at startup so `go` is discoverable.
function fixPath(): void {
  const extras: string[] = []
  if (process.platform === 'darwin' || process.platform === 'linux') {
    // Ask the user's login shell for its PATH (picks up .zshrc, .bash_profile, etc.)
    try {
      const shellBin = process.env.SHELL || '/bin/zsh'
      const shellPath = execSync(`${shellBin} -ilc 'echo -n $PATH'`, {
        timeout: 2000,
        encoding: 'utf-8'
      }).trim()
      if (shellPath) extras.push(...shellPath.split(delimiter))
    } catch { /* fall through to hardcoded paths */ }

    // Common Go and package-manager install locations
    extras.push(
      '/usr/local/go/bin',
      '/opt/homebrew/bin',
      '/opt/homebrew/sbin',
      '/usr/local/bin',
      '/usr/local/sbin',
      join(homedir(), 'go/bin'),
      join(homedir(), '.local/bin'),
    )
  } else if (process.platform === 'win32') {
    extras.push(
      'C:\\Program Files\\Go\\bin',
      'C:\\Go\\bin',
      join(homedir(), 'go', 'bin'),
    )
  }

  const existing = (process.env.PATH || '').split(delimiter)
  const merged = [...new Set([...existing, ...extras])].filter(Boolean)
  process.env.PATH = merged.join(delimiter)
}

fixPath()

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    backgroundColor: '#060a12',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Progress file path
const PROGRESS_FILE = join(homedir(), '.go-dojo-progress.json')

function loadProgress(): Record<string, any> {
  try {
    if (existsSync(PROGRESS_FILE)) {
      return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'))
    }
  } catch {}
  return {}
}

function saveProgress(data: Record<string, any>): void {
  writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2))
}

// IPC Handlers
ipcMain.handle('run-exercise', async (_event, code: string, testCode: string, goMod?: string) => {
  const workDir = join(tmpdir(), `go-dojo-${Date.now()}`)

  try {
    mkdirSync(workDir, { recursive: true })

    // Write go.mod
    writeFileSync(join(workDir, 'go.mod'), goMod || 'module exercise\n\ngo 1.21\n')

    // Write exercise file
    writeFileSync(join(workDir, 'exercise.go'), code)

    // Write test file
    writeFileSync(join(workDir, 'exercise_test.go'), testCode)

    // Run go test
    return new Promise((resolve) => {
      exec(
        'go test -v -count=1 -timeout 10s ./...',
        {
          cwd: workDir,
          timeout: 15000,
          env: { ...process.env, GOFLAGS: '' }
        },
        (error, stdout, stderr) => {
          // Clean up
          try { rmSync(workDir, { recursive: true, force: true }) } catch {}

          const output = stdout + (stderr ? '\n' + stderr : '')
          const passed = !error

          resolve({
            passed,
            output: output.trim(),
            error: error ? error.message : null
          })
        }
      )
    })
  } catch (err: any) {
    try { rmSync(workDir, { recursive: true, force: true }) } catch {}
    return {
      passed: false,
      output: '',
      error: err.message
    }
  }
})

ipcMain.handle('run-multi-file-exercise', async (_event, files: { name: string; content: string }[], testFiles: { name: string; content: string }[], goMod?: string) => {
  const workDir = join(tmpdir(), `go-dojo-${Date.now()}`)

  try {
    mkdirSync(workDir, { recursive: true })

    writeFileSync(join(workDir, 'go.mod'), goMod || 'module exercise\n\ngo 1.21\n')

    for (const f of files) {
      const dir = join(workDir, ...f.name.split('/').slice(0, -1))
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(workDir, f.name), f.content)
    }

    for (const f of testFiles) {
      const dir = join(workDir, ...f.name.split('/').slice(0, -1))
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(workDir, f.name), f.content)
    }

    return new Promise((resolve) => {
      exec(
        'go test -v -count=1 -timeout 30s ./...',
        {
          cwd: workDir,
          timeout: 35000,
          env: { ...process.env, GOFLAGS: '' }
        },
        (error, stdout, stderr) => {
          try { rmSync(workDir, { recursive: true, force: true }) } catch {}
          const output = stdout + (stderr ? '\n' + stderr : '')
          resolve({
            passed: !error,
            output: output.trim(),
            error: error ? error.message : null
          })
        }
      )
    })
  } catch (err: any) {
    try { rmSync(workDir, { recursive: true, force: true }) } catch {}
    return { passed: false, output: '', error: err.message }
  }
})

ipcMain.handle('check-go', async () => {
  try {
    const version = execSync('go version', { timeout: 5000 }).toString().trim()
    return { installed: true, version }
  } catch {
    return { installed: false, version: null }
  }
})

ipcMain.handle('load-progress', async () => {
  return loadProgress()
})

ipcMain.handle('save-progress', async (_event, data: Record<string, any>) => {
  saveProgress(data)
  return true
})

// ---------------------------------------------------------------------------
// Workspace helpers
// ---------------------------------------------------------------------------

const WORKSPACES_BASE = join(homedir(), '.go-dojo', 'workspaces')

function workspaceDir(workspaceId: string): string {
  if (!workspaceId || /[/\\.]/.test(workspaceId)) {
    throw new Error(`Invalid workspace ID: ${workspaceId}`)
  }
  return join(WORKSPACES_BASE, workspaceId)
}

function resolveWorkspaceFile(workspaceId: string, fileName: string): string {
  const base = workspaceDir(workspaceId)
  const resolved = join(base, fileName)
  if (!resolved.startsWith(base + sep)) {
    throw new Error('Invalid file path')
  }
  return resolved
}

interface WorkspaceFile {
  name: string
  content: string
  isReadOnly: boolean
}

interface WorkspaceState {
  workspaceId: string
  projectDir: string
  files: WorkspaceFile[]
  goMod: string
}

function readWorkspaceState(workspaceId: string): WorkspaceState {
  const dir = workspaceDir(workspaceId)
  const entries = readdirSync(dir).filter((f) => {
    const full = join(dir, f)
    return statSync(full).isFile() && f !== 'go.mod' && f !== 'go.sum'
  })

  const files: WorkspaceFile[] = entries.map((name) => ({
    name,
    content: readFileSync(join(dir, name), 'utf-8'),
    isReadOnly: name.endsWith('_test.go')
  }))

  const goMod = existsSync(join(dir, 'go.mod'))
    ? readFileSync(join(dir, 'go.mod'), 'utf-8')
    : ''

  return { workspaceId, projectDir: dir, files, goMod }
}

interface WorkspaceScaffold {
  goMod: string
  files: { name: string; content: string }[]
  testFiles: { name: string; content: string }[]
}

// ---------------------------------------------------------------------------
// Workspace IPC handlers
// ---------------------------------------------------------------------------

ipcMain.handle(
  'workspace:init',
  async (_event, workspaceId: string, scaffold: WorkspaceScaffold) => {
    const dir = workspaceDir(workspaceId)
    const isNew = !existsSync(dir)

    mkdirSync(dir, { recursive: true })

    if (isNew) {
      writeFileSync(join(dir, 'go.mod'), scaffold.goMod)
      for (const f of scaffold.files) {
        writeFileSync(join(dir, f.name), f.content)
      }
    }

    for (const f of scaffold.testFiles) {
      writeFileSync(join(dir, f.name), f.content)
    }

    return readWorkspaceState(workspaceId)
  }
)

ipcMain.handle('workspace:load', async (_event, workspaceId: string) => {
  const dir = workspaceDir(workspaceId)
  if (!existsSync(dir)) return null
  return readWorkspaceState(workspaceId)
})

ipcMain.handle(
  'workspace:readFile',
  async (_event, workspaceId: string, fileName: string) => {
    const filePath = resolveWorkspaceFile(workspaceId, fileName)
    return readFileSync(filePath, 'utf-8')
  }
)

ipcMain.handle(
  'workspace:writeFile',
  async (_event, workspaceId: string, fileName: string, content: string) => {
    if (fileName.endsWith('_test.go')) {
      throw new Error('Cannot write to test files')
    }
    const filePath = resolveWorkspaceFile(workspaceId, fileName)
    writeFileSync(filePath, content)
  }
)

ipcMain.handle(
  'workspace:createFile',
  async (_event, workspaceId: string, fileName: string) => {
    if (!fileName.endsWith('.go')) {
      throw new Error('Only .go files can be created')
    }
    if (fileName.endsWith('_test.go')) {
      throw new Error('Cannot create test files')
    }
    const filePath = resolveWorkspaceFile(workspaceId, fileName)
    if (existsSync(filePath)) {
      throw new Error(`File already exists: ${fileName}`)
    }
    writeFileSync(filePath, 'package main\n')
    return readWorkspaceState(workspaceId)
  }
)

ipcMain.handle(
  'workspace:deleteFile',
  async (_event, workspaceId: string, fileName: string) => {
    if (fileName.endsWith('_test.go')) {
      throw new Error('Cannot delete test files')
    }
    const filePath = resolveWorkspaceFile(workspaceId, fileName)
    unlinkSync(filePath)
    return readWorkspaceState(workspaceId)
  }
)

ipcMain.handle(
  'workspace:renameFile',
  async (_event, workspaceId: string, oldName: string, newName: string) => {
    if (oldName.endsWith('_test.go')) {
      throw new Error('Cannot rename test files')
    }
    if (newName.endsWith('_test.go')) {
      throw new Error('Cannot rename to a test file name')
    }
    if (!newName.endsWith('.go')) {
      throw new Error('Only .go files are allowed')
    }
    const oldPath = resolveWorkspaceFile(workspaceId, oldName)
    const newPath = resolveWorkspaceFile(workspaceId, newName)
    if (existsSync(newPath)) {
      throw new Error(`File already exists: ${newName}`)
    }
    renameSync(oldPath, newPath)
    return readWorkspaceState(workspaceId)
  }
)

ipcMain.handle(
  'workspace:runTests',
  async (_event, workspaceId: string, testPattern?: string) => {
    const dir = workspaceDir(workspaceId)
    const runFlag = testPattern ? ` -run ${testPattern}` : ''
    const cmd = `go test -v -count=1 -timeout 30s${runFlag} ./...`

    return new Promise((resolve) => {
      exec(cmd, { cwd: dir, timeout: 35000, env: { ...process.env, GOFLAGS: '' } },
        (error, stdout, stderr) => {
          const output = stdout + (stderr ? '\n' + stderr : '')
          resolve({
            passed: !error,
            output: output.trim(),
            error: error ? error.message : null,
            stepTestFile: testPattern || undefined
          })
        }
      )
    })
  }
)

ipcMain.handle('workspace:runBuild', async (_event, workspaceId: string) => {
  const dir = workspaceDir(workspaceId)

  return new Promise((resolve) => {
    exec('go build ./...', { cwd: dir, timeout: 30000, env: { ...process.env, GOFLAGS: '' } },
      (error, stdout, stderr) => {
        const output = stdout + (stderr ? '\n' + stderr : '')
        resolve({
          passed: !error,
          output: output.trim(),
          error: error ? error.message : null
        })
      }
    )
  })
})

ipcMain.handle('workspace:openInFinder', async (_event, workspaceId: string) => {
  const dir = workspaceDir(workspaceId)
  await shell.openPath(dir)
})

// App lifecycle
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
