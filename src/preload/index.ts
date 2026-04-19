import { contextBridge, ipcRenderer } from 'electron'

export interface RunResult {
  passed: boolean
  output: string
  error: string | null
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
}

contextBridge.exposeInMainWorld('api', api)
