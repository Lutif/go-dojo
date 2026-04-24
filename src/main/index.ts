import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join, delimiter } from 'path'
import { execSync, exec } from 'child_process'
import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'fs'
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
