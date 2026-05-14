import { useState, useCallback, useRef, useEffect } from 'react'
import { Exercise, WorkspaceState, WorkspaceFile, WorkspaceRunResult, isWorkspaceExercise } from '../types'

export interface UseWorkspaceResult {
  workspace: WorkspaceState | null
  activeFile: string | null
  loading: boolean
  error: string | null
  output: WorkspaceRunResult | null
  running: boolean
  setActiveFile: (name: string) => void
  updateFileContent: (name: string, content: string) => void
  createFile: (name: string) => Promise<void>
  deleteFile: (name: string) => Promise<void>
  renameFile: (oldName: string, newName: string) => Promise<void>
  runTests: () => Promise<WorkspaceRunResult>
  runBuild: () => Promise<WorkspaceRunResult>
  openInFinder: () => void
  getFileContent: (name: string) => string
}

export function useWorkspace(exercise: Exercise | null): UseWorkspaceResult {
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null)
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<WorkspaceRunResult | null>(null)
  const [running, setRunning] = useState(false)

  const localEdits = useRef<Record<string, string>>({})
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const workspaceIdRef = useRef<string | null>(null)

  const exerciseIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!exercise || !isWorkspaceExercise(exercise)) {
      setWorkspace(null)
      setActiveFile(null)
      setError(null)
      setOutput(null)
      localEdits.current = {}
      workspaceIdRef.current = null
      exerciseIdRef.current = null
      return
    }

    const wsId = exercise.workspaceId!
    const exId = exercise.id
    const sameWorkspace = wsId === workspaceIdRef.current
    const sameExercise = exId === exerciseIdRef.current
    if (sameWorkspace && sameExercise) return

    workspaceIdRef.current = wsId
    exerciseIdRef.current = exId
    if (!sameWorkspace) {
      setLoading(true)
      localEdits.current = {}
    }
    setError(null)
    setOutput(null)

    window.api.workspace
      .init(wsId, exercise.workspaceScaffold!)
      .then((state) => {
        if (workspaceIdRef.current !== wsId) return
        setWorkspace(state)
        if (!sameWorkspace) {
          const userFiles = state.files.filter((f) => !f.isReadOnly)
          const firstFile = userFiles[0]?.name ?? state.files[0]?.name ?? null
          setActiveFile(firstFile)
        }
        setLoading(false)
      })
      .catch((err: Error) => {
        if (workspaceIdRef.current !== wsId) return
        setError(err.message)
        setLoading(false)
      })

    return () => {
      Object.values(saveTimers.current).forEach(clearTimeout)
      saveTimers.current = {}
    }
  }, [exercise?.workspaceId, exercise?.id])

  const getFileContent = useCallback(
    (name: string): string => {
      if (localEdits.current[name] != null) return localEdits.current[name]
      const file = workspace?.files.find((f) => f.name === name)
      return file?.content ?? ''
    },
    [workspace]
  )

  const updateFileContent = useCallback(
    (name: string, content: string) => {
      if (!workspace) return
      localEdits.current[name] = content

      if (saveTimers.current[name]) clearTimeout(saveTimers.current[name])
      saveTimers.current[name] = setTimeout(() => {
        const wsId = workspaceIdRef.current
        if (!wsId) return
        window.api.workspace.writeFile(wsId, name, content).catch(() => {})
        delete saveTimers.current[name]
      }, 800)
    },
    [workspace]
  )

  const flushPendingSaves = useCallback(async () => {
    const wsId = workspaceIdRef.current
    if (!wsId) return
    const pending = Object.entries(localEdits.current)
    for (const [name, content] of pending) {
      if (saveTimers.current[name]) {
        clearTimeout(saveTimers.current[name])
        delete saveTimers.current[name]
      }
      const file = workspace?.files.find((f) => f.name === name)
      if (!file?.isReadOnly) {
        await window.api.workspace.writeFile(wsId, name, content).catch(() => {})
      }
    }
  }, [workspace])

  const refreshWorkspace = useCallback(async () => {
    const wsId = workspaceIdRef.current
    if (!wsId) return
    const state = await window.api.workspace.load(wsId)
    if (state && workspaceIdRef.current === wsId) {
      setWorkspace(state)
      localEdits.current = {}
    }
  }, [])

  const createFile = useCallback(
    async (name: string) => {
      const wsId = workspaceIdRef.current
      if (!wsId) return
      try {
        const state = await window.api.workspace.createFile(wsId, name)
        setWorkspace(state)
        localEdits.current = {}
        setActiveFile(name)
      } catch (err: any) {
        setError(err.message)
      }
    },
    []
  )

  const deleteFile = useCallback(
    async (name: string) => {
      const wsId = workspaceIdRef.current
      if (!wsId) return
      try {
        delete localEdits.current[name]
        const state = await window.api.workspace.deleteFile(wsId, name)
        setWorkspace(state)
        if (activeFile === name) {
          const userFiles = state.files.filter((f) => !f.isReadOnly)
          setActiveFile(userFiles[0]?.name ?? state.files[0]?.name ?? null)
        }
      } catch (err: any) {
        setError(err.message)
      }
    },
    [activeFile]
  )

  const renameFile = useCallback(
    async (oldName: string, newName: string) => {
      const wsId = workspaceIdRef.current
      if (!wsId) return
      try {
        const content = localEdits.current[oldName]
        delete localEdits.current[oldName]
        if (content != null) localEdits.current[newName] = content
        const state = await window.api.workspace.renameFile(wsId, oldName, newName)
        setWorkspace(state)
        if (activeFile === oldName) setActiveFile(newName)
      } catch (err: any) {
        setError(err.message)
      }
    },
    [activeFile]
  )

  const runTests = useCallback(async (): Promise<WorkspaceRunResult> => {
    const wsId = workspaceIdRef.current
    if (!wsId) return { passed: false, output: '', error: 'No workspace' }
    setRunning(true)
    setOutput(null)
    try {
      await flushPendingSaves()
      const pattern = exercise?.testRunPattern
      const result = await window.api.workspace.runTests(wsId, pattern)
      setOutput(result)
      return result
    } catch (err: any) {
      const result: WorkspaceRunResult = { passed: false, output: '', error: err.message }
      setOutput(result)
      return result
    } finally {
      setRunning(false)
    }
  }, [exercise?.testRunPattern, flushPendingSaves])

  const runBuild = useCallback(async (): Promise<WorkspaceRunResult> => {
    const wsId = workspaceIdRef.current
    if (!wsId) return { passed: false, output: '', error: 'No workspace' }
    setRunning(true)
    setOutput(null)
    try {
      await flushPendingSaves()
      const result = await window.api.workspace.runBuild(wsId)
      setOutput(result)
      return result
    } catch (err: any) {
      const result: WorkspaceRunResult = { passed: false, output: '', error: err.message }
      setOutput(result)
      return result
    } finally {
      setRunning(false)
    }
  }, [flushPendingSaves])

  const openInFinder = useCallback(() => {
    const wsId = workspaceIdRef.current
    if (wsId) window.api.workspace.openInFinder(wsId)
  }, [])

  return {
    workspace,
    activeFile,
    loading,
    error,
    output,
    running,
    setActiveFile,
    updateFileContent,
    createFile,
    deleteFile,
    renameFile,
    runTests,
    runBuild,
    openInFinder,
    getFileContent,
  }
}
