import { contextBridge, ipcRenderer } from 'electron'

export interface RunResult {
  passed: boolean
  output: string
  error: string | null
}

interface WorkspaceScaffold {
  goMod: string
  files: { name: string; content: string }[]
  testFiles: { name: string; content: string }[]
}

const api = {
  runExercise: (code: string, testCode: string, goMod?: string): Promise<RunResult> =>
    ipcRenderer.invoke('run-exercise', code, testCode, goMod),

  runMultiFileExercise: (
    files: { name: string; content: string }[],
    testFiles: { name: string; content: string }[],
    goMod?: string
  ): Promise<RunResult> =>
    ipcRenderer.invoke('run-multi-file-exercise', files, testFiles, goMod),

  checkGo: (): Promise<{ installed: boolean; version: string | null }> =>
    ipcRenderer.invoke('check-go'),

  loadProgress: (): Promise<Record<string, any>> =>
    ipcRenderer.invoke('load-progress'),

  saveProgress: (data: Record<string, any>): Promise<boolean> =>
    ipcRenderer.invoke('save-progress', data),

  workspace: {
    init: (workspaceId: string, scaffold: WorkspaceScaffold) =>
      ipcRenderer.invoke('workspace:init', workspaceId, scaffold),

    load: (workspaceId: string) =>
      ipcRenderer.invoke('workspace:load', workspaceId),

    readFile: (workspaceId: string, fileName: string) =>
      ipcRenderer.invoke('workspace:readFile', workspaceId, fileName),

    writeFile: (workspaceId: string, fileName: string, content: string) =>
      ipcRenderer.invoke('workspace:writeFile', workspaceId, fileName, content),

    createFile: (workspaceId: string, fileName: string) =>
      ipcRenderer.invoke('workspace:createFile', workspaceId, fileName),

    deleteFile: (workspaceId: string, fileName: string) =>
      ipcRenderer.invoke('workspace:deleteFile', workspaceId, fileName),

    renameFile: (workspaceId: string, oldName: string, newName: string) =>
      ipcRenderer.invoke('workspace:renameFile', workspaceId, oldName, newName),

    runTests: (workspaceId: string, testPattern?: string) =>
      ipcRenderer.invoke('workspace:runTests', workspaceId, testPattern),

    runBuild: (workspaceId: string) =>
      ipcRenderer.invoke('workspace:runBuild', workspaceId),

    openInFinder: (workspaceId: string) =>
      ipcRenderer.invoke('workspace:openInFinder', workspaceId),
  },
}

contextBridge.exposeInMainWorld('api', api)
