import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Exercise, Category, ProgressData, RunResult, ExerciseStatus, ExerciseUi } from './types'
import { getAllExercises, getCategories } from './exercises'
import { computeStatus, REQUIRES, PREREQ_HINTS } from './data/dependencies'
import Sidebar from './components/Sidebar'
import EditorPanel from './components/EditorPanel'
import OutputPanel from './components/OutputPanel'
import ExerciseInfo from './components/ExerciseInfo'
import ProgressDashboard from './components/ProgressDashboard'

export default function App() {
  const [rawExercises] = useState<Exercise[]>(getAllExercises())
  const [categories] = useState<{ name: Category; count: number }[]>(getCategories())
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [currentCode, setCurrentCode] = useState('')
  const [output, setOutput] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<ProgressData>({
    completed: {},
    drafts: {},
    submitted: {},
    bookmarks: {},
  })
  const [showHints, setShowHints] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [goVersion, setGoVersion] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<Category | 'all' | 'bookmarks'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [lockedExercise, setLockedExercise] = useState<Exercise | null>(null)
  const [testMode, setTestMode] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'paper'>(() =>
    (localStorage.getItem('go-dojo-theme') as 'dark' | 'paper') || 'dark'
  )
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(() =>
    localStorage.getItem('go-dojo-font-dyslexic') === '1'
  )

  useEffect(() => {
    document.body.classList.toggle('theme-paper', theme === 'paper')
    localStorage.setItem('go-dojo-theme', theme)
  }, [theme])
  useEffect(() => {
    document.body.classList.toggle('font-dyslexic', dyslexicFont)
    localStorage.setItem('go-dojo-font-dyslexic', dyslexicFont ? '1' : '0')
  }, [dyslexicFont])
  const editorRef = useRef<any>(null)
  const progressRef = useRef(progress)
  const currentCodeRef = useRef(currentCode)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])
  useEffect(() => {
    currentCodeRef.current = currentCode
  }, [currentCode])

  // Merge requires/prereqHints into exercises
  const exercises = useMemo<Exercise[]>(() => {
    return rawExercises.map((ex) => ({
      ...ex,
      requires: REQUIRES[ex.id] ?? [],
      prereqHints: PREREQ_HINTS[ex.id] ?? [],
    }))
  }, [rawExercises])

  // Compute exercise status whenever progress changes
  const status = useMemo<Record<string, ExerciseStatus>>(() => {
    const allIds = exercises.map((e) => e.id)
    return computeStatus(allIds, progress.completed)
  }, [exercises, progress.completed])

  const exerciseUi = progress.exerciseUi ?? {}
  const leftColumnCollapsed = exerciseUi.leftColumnCollapsed ?? false
  const outputCollapsed = exerciseUi.outputCollapsed ?? false
  const sidebarCollapsed = exerciseUi.sidebarCollapsed ?? false

  const toggleExerciseUi = useCallback(
    (key: keyof ExerciseUi) => {
      setProgress((prev) => {
        const u = prev.exerciseUi ?? {}
        const cur = u[key] ?? false
        const next: ProgressData = {
          ...prev,
          exerciseUi: { ...u, [key]: !cur },
        }
        void window.api.saveProgress(next)
        return next
      })
    },
    []
  )

  // Load progress and check Go on mount
  useEffect(() => {
    window.api.checkGo().then((result) => {
      if (result.installed) setGoVersion(result.version)
    })
    window.api.loadProgress().then((data) => {
      if (!data || typeof data !== 'object') return
      const legacy = (data as { userCode?: Record<string, string> }).userCode || {}
      const drafts = { ...legacy, ...((data as { drafts?: Record<string, string> }).drafts || {}) }
      setProgress({
        completed: (data as { completed?: Record<string, boolean> }).completed || {},
        drafts,
        submitted: (data as { submitted?: Record<string, string> }).submitted || {},
        bookmarks: (data as { bookmarks?: Record<string, boolean> }).bookmarks || {},
        exerciseUi:
          (data as { exerciseUi?: ExerciseUi }).exerciseUi &&
          typeof (data as { exerciseUi?: ExerciseUi }).exerciseUi === 'object'
            ? (data as { exerciseUi: ExerciseUi }).exerciseUi
            : {},
      })
    })
  }, [])

  const selectExercise = useCallback(
    async (exercise: Exercise, opts?: { freshCode?: string }) => {
      if (status[exercise.id] === 'locked') {
        setLockedExercise(exercise)
        return
      }

      // If filtered out by category, reveal it
      if (filterCategory !== 'all' && filterCategory !== 'bookmarks' && filterCategory !== exercise.category) {
        setFilterCategory(exercise.category)
      }

      let stored = progressRef.current
      // Persist the leaving exercise's draft — but NOT if we're in test mode,
      // where currentCode is the comment-stripped scratchpad and would clobber
      // the real draft.
      if (selectedExercise && selectedExercise.id !== exercise.id && !testMode) {
        const next: ProgressData = {
          ...stored,
          drafts: { ...stored.drafts, [selectedExercise.id]: currentCodeRef.current },
        }
        await window.api.saveProgress(next)
        setProgress(next)
        stored = next
        progressRef.current = next
      }

      setSelectedExercise(exercise)
      setOutput(null)
      setShowHints(false)
      setHintIndex(0)
      setShowSolution(false)

      if (opts?.freshCode != null) {
        setCurrentCode(opts.freshCode)
      } else {
        const draft = stored.drafts?.[exercise.id]
        const submitted = stored.submitted?.[exercise.id]
        setCurrentCode(draft ?? submitted ?? exercise.code)
      }
    },
    [status, exercises, selectedExercise, testMode]
  )

  const goToDashboard = useCallback(() => {
    if (selectedExercise && !testMode) {
      const prev = progressRef.current
      const next: ProgressData = {
        ...prev,
        drafts: { ...prev.drafts, [selectedExercise.id]: currentCodeRef.current },
      }
      void window.api.saveProgress(next)
      setProgress(next)
      progressRef.current = next
    }
    if (testMode) setTestMode(false)
    setSelectedExercise(null)
  }, [selectedExercise, testMode])

  // Autosave draft while editing (debounced) — skipped in test mode so the
  // real draft/submitted solution isn't clobbered by a test-mode rewrite.
  useEffect(() => {
    if (!selectedExercise || testMode) return
    const id = selectedExercise.id
    const code = currentCode
    const t = window.setTimeout(() => {
      const prev = progressRef.current
      if (prev.drafts?.[id] === code) return
      const next: ProgressData = {
        ...prev,
        drafts: { ...prev.drafts, [id]: code },
      }
      void window.api.saveProgress(next)
      setProgress(next)
      progressRef.current = next
    }, 1500)
    return () => clearTimeout(t)
  }, [currentCode, selectedExercise, testMode])

  const runCode = useCallback(async () => {
    if (!selectedExercise || running) return
    setRunning(true)
    setOutput(null)
    const id = selectedExercise.id

    try {
      const prev = progressRef.current
      // In test mode, don't persist the run code to drafts — it would overwrite
      // the user's saved solution with the comment-stripped starter / test answer.
      const withDraft: ProgressData = testMode
        ? prev
        : { ...prev, drafts: { ...prev.drafts, [id]: currentCode } }
      if (!testMode) {
        setProgress(withDraft)
        progressRef.current = withDraft
        await window.api.saveProgress(withDraft)
      }

      const result = await window.api.runExercise(
        currentCode,
        selectedExercise.testCode,
        selectedExercise.goMod
      )

      setOutput(result)

      if (result.passed && !testMode) {
        const next: ProgressData = {
          ...withDraft,
          completed: { ...withDraft.completed, [id]: true },
          drafts: { ...withDraft.drafts, [id]: currentCode },
          submitted: { ...withDraft.submitted, [id]: currentCode },
        }
        setProgress(next)
        progressRef.current = next
        await window.api.saveProgress(next)
      } else if (result.passed && testMode) {
        // Mark complete (user proved they can still solve it) but keep the
        // existing submitted solution intact.
        const next: ProgressData = {
          ...prev,
          completed: { ...prev.completed, [id]: true },
        }
        setProgress(next)
        progressRef.current = next
        await window.api.saveProgress(next)
      }
    } catch (err: any) {
      setOutput({ passed: false, output: '', error: err.message })
    } finally {
      setRunning(false)
    }
  }, [selectedExercise, currentCode, running, testMode])

  const resetExercise = useCallback(async () => {
    if (!selectedExercise) return
    const id = selectedExercise.id
    const prev = progressRef.current
    const drafts = { ...prev.drafts }
    delete drafts[id]
    const next: ProgressData = { ...prev, drafts }
    setProgress(next)
    progressRef.current = next
    await window.api.saveProgress(next)
    setCurrentCode(selectedExercise.code)
    setOutput(null)
    setShowHints(false)
    setHintIndex(0)
    setShowSolution(false)
  }, [selectedExercise])

  const nextExercise = useCallback(() => {
    if (!selectedExercise) return
    const filtered = getFilteredExercises()
    const idx = filtered.findIndex((e) => e.id === selectedExercise.id)
    if (idx < filtered.length - 1) {
      selectExercise(filtered[idx + 1])
    }
  }, [selectedExercise, filterCategory, searchQuery, status, progress.bookmarks, exercises, selectExercise])

  const prevExercise = useCallback(() => {
    if (!selectedExercise) return
    const filtered = getFilteredExercises()
    const idx = filtered.findIndex((e) => e.id === selectedExercise.id)
    if (idx > 0) {
      selectExercise(filtered[idx - 1])
    }
  }, [selectedExercise, filterCategory, searchQuery, status, progress.bookmarks, exercises, selectExercise])

  // Strip Go comments — test mode hides them so the user gets a blank canvas.
  // Preserves strings (// or /* inside a string literal stays intact).
  const stripGoComments = (src: string): string => {
    let out = ''
    let i = 0
    const n = src.length
    while (i < n) {
      const c = src[i]
      // double-quoted string
      if (c === '"') {
        out += c; i++
        while (i < n && src[i] !== '"') {
          if (src[i] === '\\' && i + 1 < n) { out += src[i] + src[i+1]; i += 2; continue }
          out += src[i]; i++
        }
        if (i < n) { out += src[i]; i++ }
        continue
      }
      // raw string
      if (c === '`') {
        out += c; i++
        while (i < n && src[i] !== '`') { out += src[i]; i++ }
        if (i < n) { out += src[i]; i++ }
        continue
      }
      // line comment
      if (c === '/' && src[i+1] === '/') {
        while (i < n && src[i] !== '\n') i++
        continue
      }
      // block comment
      if (c === '/' && src[i+1] === '*') {
        i += 2
        while (i < n && !(src[i] === '*' && src[i+1] === '/')) i++
        i += 2
        continue
      }
      out += c; i++
    }
    // Collapse runs of blank lines and trim trailing whitespace per line
    return out
      .split('\n')
      .map((line) => line.replace(/[ \t]+$/, ''))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
  }

  const pickRandomBookmark = useCallback((excludeId?: string) => {
    const bookmarkIds = Object.keys(progressRef.current.bookmarks ?? {}).filter(
      (id) => progressRef.current.bookmarks?.[id]
    )
    const candidates = bookmarkIds
      .filter((id) => id !== excludeId)
      .map((id) => exercises.find((e) => e.id === id))
      .filter((e): e is Exercise => !!e && status[e.id] !== 'locked')
    if (candidates.length === 0) {
      // fallback: include the excluded one if it's the only bookmark
      const all = bookmarkIds
        .map((id) => exercises.find((e) => e.id === id))
        .filter((e): e is Exercise => !!e && status[e.id] !== 'locked')
      if (all.length === 0) return null
      return all[Math.floor(Math.random() * all.length)]
    }
    return candidates[Math.floor(Math.random() * candidates.length)]
  }, [exercises, status])

  const startTestMode = useCallback(() => {
    const next = pickRandomBookmark(selectedExercise?.id)
    if (!next) return
    setTestMode(true)
    setShowHints(false)
    setShowSolution(false)
    selectExercise(next, { freshCode: stripGoComments(next.code) })
  }, [pickRandomBookmark, selectExercise, selectedExercise?.id])

  const nextRandomTest = useCallback(() => {
    const next = pickRandomBookmark(selectedExercise?.id)
    if (!next) { setTestMode(false); return }
    selectExercise(next, { freshCode: stripGoComments(next.code) })
  }, [pickRandomBookmark, selectExercise, selectedExercise?.id])

  const exitTestMode = useCallback(() => {
    setTestMode(false)
    // Restore the saved draft/submitted solution for the current exercise
    if (selectedExercise) {
      const stored = progressRef.current
      const draft = stored.drafts?.[selectedExercise.id]
      const submitted = stored.submitted?.[selectedExercise.id]
      setCurrentCode(draft ?? submitted ?? selectedExercise.code)
    }
  }, [selectedExercise])

  const toggleBookmark = useCallback(
    async (exerciseId: string) => {
      const marks = { ...(progress.bookmarks ?? {}) }
      if (marks[exerciseId]) {
        delete marks[exerciseId]
      } else {
        marks[exerciseId] = true
      }
      const newProgress: ProgressData = { ...progress, bookmarks: marks }
      setProgress(newProgress)
      await window.api.saveProgress(newProgress)
    },
    [progress]
  )

  function getFilteredExercises() {
    let filtered = exercises
    if (filterCategory === 'bookmarks') {
      const bm = progress.bookmarks ?? {}
      filtered = exercises.filter((e) => bm[e.id])
    } else if (filterCategory !== 'all') {
      filtered = filtered.filter((e) => e.category === filterCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.subcategory.toLowerCase().includes(q)
      )
    }
    return filtered
  }

  const filteredExercises = getFilteredExercises()
  const completedCount = Object.keys(progress.completed).filter((k) => progress.completed[k]).length
  const totalCount = exercises.length

  const solutionMatchesSubmitted = useMemo(() => {
    if (!selectedExercise) return false
    const sid = selectedExercise.id
    const sub = progress.submitted?.[sid]
    return !!progress.completed[sid] && sub != null && currentCode === sub
  }, [selectedExercise, progress.submitted, progress.completed, currentCode])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        runCode()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault()
        resetExercise()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [runCode, resetExercise])

  if (!goVersion) {
    return (
      <div className="h-screen flex items-center justify-center bg-go-darker">
        <div className="text-center space-y-4">
          <div className="text-6xl">&#128533;</div>
          <h1 className="text-2xl font-bold text-go-text">Go Not Found</h1>
          <p className="text-go-muted max-w-md">
            Go Dojo requires Go to be installed on your system.
            Please install Go from{' '}
            <a href="https://go.dev/dl/" className="text-go-blue hover:underline">
              go.dev/dl
            </a>{' '}
            and restart the app.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-go-darker overflow-hidden">
      {/* Locked exercise modal */}
      {lockedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
          onClick={() => setLockedExercise(null)}
        >
          <div
            className="max-w-md w-full mx-4 bg-go-surface border border-go-border rounded-lg shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔒</span>
              <h3 className="text-go-text text-base font-semibold flex-1">
                {lockedExercise.title}
              </h3>
              <button
                onClick={() => setLockedExercise(null)}
                className="text-go-muted hover:text-go-text text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="text-go-muted text-sm mb-3">
              Complete these first:
            </p>
            <ul className="space-y-1.5">
              {(REQUIRES[lockedExercise.id] ?? [])
                .filter((id) => !progress.completed[id])
                .map((id) => {
                  const ex = exercises.find((e) => e.id === id)
                  if (!ex) return null
                  const reqStatus = status[id] ?? 'available'
                  const reqLocked = reqStatus === 'locked'
                  return (
                    <li key={id}>
                      <button
                        onClick={() => {
                          setLockedExercise(null)
                          selectExercise(ex)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                          reqLocked
                            ? 'border-go-border/40 bg-go-surface2/30 text-go-muted'
                            : 'border-go-blue/40 bg-go-blue/10 text-go-blue hover:bg-go-blue/20'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wide text-go-muted/70 mr-2">
                          {ex.category}
                        </span>
                        <span className="text-sm">{ex.title}</span>
                        {reqLocked && (
                          <span className="ml-2 text-[10px] text-go-muted">also locked</span>
                        )}
                      </button>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        exercises={filteredExercises}
        categories={categories}
        selectedExercise={selectedExercise}
        progress={progress}
        status={status}
        filterCategory={filterCategory}
        searchQuery={searchQuery}
        collapsed={sidebarCollapsed}
        completedCount={completedCount}
        totalCount={totalCount}
        onSelectExercise={selectExercise}
        onFilterCategory={setFilterCategory}
        onSearchQuery={setSearchQuery}
        onToggleCollapse={() => toggleExerciseUi('sidebarCollapsed')}
        onGoToDashboard={goToDashboard}
        onStartTest={startTestMode}
        testModeActive={testMode}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedExercise ? (
          <>
            {/* Top bar */}
            <div className="h-12 border-b border-go-border flex items-center px-4 justify-between bg-go-darker shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevExercise}
                  className="text-go-muted hover:text-go-text transition-colors text-sm"
                >
                  &#8592; Prev
                </button>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    progress.completed[selectedExercise.id] ? 'bg-go-success' : 'bg-go-muted'
                  }`} />
                  <span className="font-semibold text-go-text text-sm">
                    {selectedExercise.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedExercise.difficulty === 'beginner' ? 'bg-green-900/50 text-green-400' :
                    selectedExercise.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                    selectedExercise.difficulty === 'advanced' ? 'bg-orange-900/50 text-orange-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {selectedExercise.difficulty}
                  </span>
                  {solutionMatchesSubmitted ? (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded bg-go-success/15 text-go-success/90 border border-go-success/25"
                      title="Your code passed all tests and is saved as your solution"
                    >
                      Solution saved
                    </span>
                  ) : (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded bg-go-surface2/80 text-go-muted border border-go-border/60"
                      title="Draft is saved automatically; run tests to save a passing solution"
                    >
                      Draft
                    </span>
                  )}
                </div>
                <button
                  onClick={nextExercise}
                  className="text-go-muted hover:text-go-text transition-colors text-sm"
                >
                  Next &#8594;
                </button>
                <button
                  type="button"
                  onClick={() => toggleBookmark(selectedExercise.id)}
                  className={`ml-1 p-1 rounded transition-colors ${
                    progress.bookmarks?.[selectedExercise.id]
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-go-muted hover:text-yellow-400/80'
                  }`}
                  title={
                    progress.bookmarks?.[selectedExercise.id]
                      ? 'Remove bookmark'
                      : 'Bookmark to revisit'
                  }
                  aria-pressed={!!progress.bookmarks?.[selectedExercise.id]}
                >
                  {progress.bookmarks?.[selectedExercise.id] ? '★' : '☆'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'paper' : 'dark')}
                  className="px-2 py-1.5 text-xs bg-go-surface hover:bg-go-surface2 border border-go-border rounded-md text-go-muted hover:text-go-text transition-all"
                  title={theme === 'dark' ? 'Switch to paper theme' : 'Switch to dark theme'}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? '☽' : '☼'}
                </button>
                <button
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  className={`px-2 py-1.5 text-xs border rounded-md transition-all ${
                    dyslexicFont
                      ? 'bg-go-blue/20 border-go-blue/40 text-go-blue'
                      : 'bg-go-surface hover:bg-go-surface2 border-go-border text-go-muted hover:text-go-text'
                  }`}
                  title={dyslexicFont ? 'Use default font' : 'Use dyslexia-friendly font (Lexend)'}
                  aria-pressed={dyslexicFont}
                >
                  Aa
                </button>
                <button
                  onClick={resetExercise}
                  className="px-3 py-1.5 text-xs bg-go-surface hover:bg-go-surface2 border border-go-border rounded-md text-go-muted hover:text-go-text transition-all"
                  title="Reset (Cmd+R)"
                >
                  Reset
                </button>
                {!testMode && (
                  <>
                    <button
                      onClick={() => { setShowHints(!showHints); setShowSolution(false) }}
                      className="px-3 py-1.5 text-xs bg-go-surface hover:bg-go-surface2 border border-go-border rounded-md text-go-muted hover:text-go-text transition-all"
                    >
                      {showHints ? 'Hide Hints' : 'Hints'}
                    </button>
                    <button
                      onClick={() => { setShowSolution(!showSolution); setShowHints(false) }}
                      className="px-3 py-1.5 text-xs bg-go-surface hover:bg-go-surface2 border border-go-border rounded-md text-go-muted hover:text-go-text transition-all"
                    >
                      {showSolution ? 'Hide Solution' : 'Solution'}
                    </button>
                  </>
                )}
                {testMode && (
                  <>
                    <button
                      onClick={nextRandomTest}
                      className="px-3 py-1.5 text-xs bg-go-blue/20 border border-go-blue/40 text-go-blue hover:bg-go-blue/30 rounded-md transition-all"
                      title="Skip to another random bookmarked exercise"
                    >
                      🎯 Next
                    </button>
                    <button
                      onClick={exitTestMode}
                      className="px-3 py-1.5 text-xs bg-go-surface hover:bg-go-surface2 border border-go-border rounded-md text-go-muted hover:text-go-text transition-all"
                      title="Exit test mode"
                    >
                      Exit Test
                    </button>
                  </>
                )}
                <button
                  onClick={runCode}
                  disabled={running}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    running
                      ? 'bg-go-surface text-go-muted cursor-not-allowed'
                      : 'bg-go-blue hover:bg-go-cyan text-white pulse-glow'
                  }`}
                  title="Run (Cmd+Enter)"
                >
                  {running ? 'Running...' : '\u25B6 Run Tests'}
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 flex min-h-0 w-full overflow-hidden">
              {/* Left: Problem + output (full column can collapse for a wider editor) */}
              {leftColumnCollapsed ? (
                <div className="w-11 shrink-0 h-full flex flex-col items-center pt-2 border-r border-go-border bg-go-darker/50">
                  <button
                    type="button"
                    onClick={() => toggleExerciseUi('leftColumnCollapsed')}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-go-muted hover:text-go-text hover:bg-go-surface2/60 transition-colors text-sm"
                    title="Expand exercise panel (problem, hints, test output)"
                    aria-label="Expand exercise panel"
                  >
                    ▶
                  </button>
                </div>
              ) : (
                <div className="w-[380px] h-full flex flex-col border-r border-go-border shrink-0 overflow-hidden">
                  <div className="h-9 flex items-center justify-between gap-2 px-3 bg-go-surface/30 text-xs shrink-0 border-b border-go-border/50">
                    <span className="font-semibold text-go-text">Exercise</span>
                    <button
                      type="button"
                      onClick={() => toggleExerciseUi('leftColumnCollapsed')}
                      className="shrink-0 px-2 py-0.5 rounded text-[10px] text-go-muted hover:text-go-text hover:bg-go-surface2/60 transition-colors"
                      title="Collapse panel (more space for code)"
                    >
                      ◀ Collapse
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                    <div className="flex-1 min-h-0 overflow-hidden flex flex-col border-b border-go-border/50">
                      <ExerciseInfo
                        exercise={selectedExercise}
                        showHints={showHints && !testMode}
                        hintIndex={hintIndex}
                        showSolution={showSolution && !testMode}
                        testMode={testMode}
                        status={status}
                        allExercises={exercises}
                        onNextHint={() =>
                          setHintIndex(Math.min(hintIndex + 1, selectedExercise.hints.length - 1))
                        }
                        onSelectExercise={selectExercise}
                      />
                    </div>
                    <div className={`flex flex-col min-h-0 ${outputCollapsed ? 'shrink-0' : 'flex-1'}`}>
                      <OutputPanel
                        output={output}
                        running={running}
                        collapsed={outputCollapsed}
                        onToggleCollapse={() => toggleExerciseUi('outputCollapsed')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Right: Editor */}
              <div className="flex-1 min-w-0 h-full overflow-hidden">
                <EditorPanel
                  code={currentCode}
                  onChange={setCurrentCode}
                  editorRef={editorRef}
                />
              </div>
            </div>
          </>
        ) : (
          <ProgressDashboard
            exercises={exercises}
            progress={progress}
            status={status}
            prereqHints={PREREQ_HINTS}
            onSelectExercise={selectExercise}
            onFilterCategory={(cat) => { setFilterCategory(cat) }}
            onShowBookmarks={() => setFilterCategory('bookmarks')}
          />
        )}
      </div>
    </div>
  )
}
