import React from 'react'
import { Exercise, Category, ProgressData, ExerciseStatus } from '../types'
import SkillTreeFlow from './SkillTreeFlow'

interface Props {
  exercises: Exercise[]
  progress: ProgressData
  status: Record<string, ExerciseStatus>
  prereqHints: Record<string, Array<{ text: string; exerciseId: string; exerciseTitle: string }>>
  onSelectExercise: (e: Exercise) => void
  onFilterCategory: (cat: Category) => void
  /** Focus the sidebar list on bookmarked exercises */
  onShowBookmarks?: () => void
}

// Category color config
const CAT_COLORS: Record<string, { node: string; ring: string; text: string; bg: string; border: string; glow: string }> = {
  'Basics':          { node: '#22c55e', ring: '#22c55e', text: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/30',  glow: 'shadow-green-500/20' },
  'Type System':     { node: '#00ADD8', ring: '#00ADD8', text: 'text-go-blue',     bg: 'bg-go-blue/10',     border: 'border-go-blue/30',    glow: 'shadow-go-blue/20' },
  'Error Handling':  { node: '#ef4444', ring: '#ef4444', text: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',    glow: 'shadow-red-500/20' },
  'Concurrency':     { node: '#a855f7', ring: '#a855f7', text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  'Standard Library':{ node: '#f59e0b', ring: '#f59e0b', text: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
  'Patterns':        { node: '#5DC9E2', ring: '#5DC9E2', text: 'text-go-cyan',     bg: 'bg-go-cyan/10',     border: 'border-go-cyan/30',    glow: 'shadow-go-cyan/20' },
  'Internals':       { node: '#f97316', ring: '#f97316', text: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
  'Networking':      { node: '#ec4899', ring: '#ec4899', text: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/30',   glow: 'shadow-pink-500/20' },
  'Data & Storage':  { node: '#6366f1', ring: '#6366f1', text: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20' },
  'Projects':        { node: '#10b981', ring: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
}

const CATEGORIES: Category[] = [
  'Basics', 'Type System', 'Error Handling', 'Concurrency', 'Standard Library',
  'Patterns', 'Internals', 'Networking', 'Data & Storage', 'Projects',
]

const CAT_NUMS: Record<string, string> = {
  'Basics': '01', 'Type System': '02', 'Error Handling': '03', 'Concurrency': '04',
  'Standard Library': '05', 'Patterns': '06', 'Internals': '07', 'Networking': '08',
  'Data & Storage': '09', 'Projects': '10',
}

// ─── Circular Progress Ring ─────────────────────────────────────────────────
function ProgressRing({ pct, color, size = 52 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2d3d" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.7s ease' }}
      />
    </svg>
  )
}

// ─── Category Card ──────────────────────────────────────────────────────────
function CategoryCard({
  cat, exercises, status, onClick,
}: {
  cat: Category
  exercises: Exercise[]
  status: Record<string, ExerciseStatus>
  onClick: () => void
}) {
  const colors = CAT_COLORS[cat]
  const total = exercises.length
  const completed = exercises.filter((e) => status[e.id] === 'completed').length
  const available = exercises.filter((e) => status[e.id] === 'available').length
  const locked = exercises.filter((e) => status[e.id] === 'locked').length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = completed === total && total > 0

  return (
    <button
      onClick={onClick}
      className={`relative text-left p-4 rounded-xl border transition-all hover:scale-[1.02] group ${
        allDone
          ? 'bg-gradient-to-br from-go-success/15 to-go-success/5 border-go-success/40 shadow-lg shadow-go-success/10'
          : `${colors.bg} ${colors.border} hover:${colors.border}`
      }`}
    >
      {allDone && (
        <div className="absolute top-2 right-2 text-go-success text-xs font-bold">MASTERED</div>
      )}
      <div className="flex items-center gap-3 mb-3">
        {/* Ring */}
        <div className="relative shrink-0">
          <ProgressRing pct={pct} color={allDone ? '#22c55e' : colors.node} size={52} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[11px] font-bold ${allDone ? 'text-go-success' : colors.text}`}>
              {pct}%
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-mono text-go-muted">{CAT_NUMS[cat]}</span>
            <span className={`text-sm font-semibold truncate ${allDone ? 'text-go-success' : 'text-go-text group-hover:' + colors.text}`}>
              {cat}
            </span>
          </div>
          <div className="text-[11px] text-go-muted">{completed}/{total} completed</div>
        </div>
      </div>

      {/* Segmented status bar */}
      <div className="h-1.5 flex rounded-full overflow-hidden gap-px">
        {completed > 0 && (
          <div
            className="bg-go-success rounded-l-full transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        )}
        {available > 0 && (
          <div
            className="bg-go-blue/70 transition-all duration-500"
            style={{ width: `${(available / total) * 100}%` }}
          />
        )}
        {locked > 0 && (
          <div
            className="bg-go-surface2 rounded-r-full transition-all duration-500"
            style={{ width: `${(locked / total) * 100}%` }}
          />
        )}
      </div>
    </button>
  )
}

// ─── "Ready to Learn" Card ───────────────────────────────────────────────────
function ReadyCard({
  exercise,
  status,
  exercises,
  requires,
  progress,
  onSelect,
}: {
  exercise: Exercise
  status: Record<string, ExerciseStatus>
  exercises: Exercise[]
  requires: string[]
  progress: ProgressData
  onSelect: () => void
}) {
  const colors = CAT_COLORS[exercise.category]

  // Find the most recently completed prereq that directly unlocked this exercise
  const justUnlocked = requires
    .filter((id) => progress.completed[id])
    .map((id) => exercises.find((e) => e.id === id))
    .filter(Boolean)[0] as Exercise | undefined

  return (
    <button
      onClick={onSelect}
      className={`shrink-0 w-56 text-left p-3 rounded-xl ${colors.bg} ${colors.border} border hover:scale-[1.02] transition-all snap-start`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
          {CAT_NUMS[exercise.category]}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          exercise.difficulty === 'beginner' ? 'bg-green-900/50 text-green-400' :
          exercise.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
          exercise.difficulty === 'advanced' ? 'bg-orange-900/50 text-orange-400' :
          'bg-red-900/50 text-red-400'
        }`}>
          {exercise.difficulty}
        </span>
      </div>
      <div className="text-sm font-semibold text-go-text mb-2 leading-tight">{exercise.title}</div>
      {justUnlocked && (
        <div className="text-[10px] text-go-muted flex items-center gap-1">
          <span className="text-go-success">✓</span>
          Unlocked by: {justUnlocked.title}
        </div>
      )}
    </button>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function ProgressDashboard({
  exercises, progress, status, prereqHints,
  onSelectExercise, onFilterCategory, onShowBookmarks,
}: Props) {
  const completedCount = exercises.filter((e) => status[e.id] === 'completed').length
  const totalCount = exercises.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const bookmarkedExercises = exercises
    .filter((e) => progress.bookmarks?.[e.id])
    .sort((a, b) => {
      const c = a.category.localeCompare(b.category)
      if (c !== 0) return c
      return a.order - b.order
    })

  // Categories mastered
  const categoriesMastered = CATEGORIES.filter((cat) => {
    const exs = exercises.filter((e) => e.category === cat)
    return exs.length > 0 && exs.every((e) => status[e.id] === 'completed')
  })

  // Available exercises not yet started
  const availableExercises = exercises.filter((e) => status[e.id] === 'available')

  // Simple streak: count entries in completed
  const hasActivity = Object.keys(progress.completed).some((k) => progress.completed[k])

  return (
    <div className="h-full overflow-y-auto bg-go-darker">
      {/* ── A. Hero Bar ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-go-surface/80 to-go-surface2/60 border-b border-go-border/60 backdrop-blur px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-go-blue font-bold text-2xl font-mono">Go</span>
            <span className="text-go-text font-bold text-2xl">Dojo</span>
          </div>

          <div className="flex flex-wrap items-end gap-8 mt-4">
            {/* Big completion % */}
            <div>
              <div className="text-5xl font-bold text-go-text tabular-nums leading-none">
                {pct}
                <span className="text-2xl text-go-muted font-normal">%</span>
              </div>
              <div className="text-xs text-go-muted mt-1">Overall completion</div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-go-success">{completedCount}</div>
                <div className="text-[11px] text-go-muted">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-go-muted">{totalCount}</div>
                <div className="text-[11px] text-go-muted">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{categoriesMastered.length}</div>
                <div className="text-[11px] text-go-muted">Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-go-blue">{availableExercises.length}</div>
                <div className="text-[11px] text-go-muted">Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{bookmarkedExercises.length}</div>
                <div className="text-[11px] text-go-muted">Bookmarked</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex-1 min-w-48">
              <div className="flex justify-between text-xs text-go-muted mb-1.5">
                <span>{completedCount}/{totalCount} exercises</span>
                {hasActivity && <span className="text-go-success">Keep going!</span>}
              </div>
              <div className="h-3 bg-go-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-go-blue to-go-cyan rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[11px] text-go-muted mt-1">
                {availableExercises.length} exercise{availableExercises.length !== 1 ? 's' : ''} unlocked and ready
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6 space-y-8">
        {/* ── Bookmarks ───────────────────────────────────────────────── */}
        {bookmarkedExercises.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-sm font-semibold text-go-muted uppercase tracking-wider">
                Bookmarked
                <span className="ml-2 text-yellow-400/90 font-normal normal-case">
                  {bookmarkedExercises.length} to revisit
                </span>
              </h2>
              {onShowBookmarks && (
                <button
                  type="button"
                  onClick={onShowBookmarks}
                  className="text-xs text-go-blue hover:text-go-cyan transition-colors"
                >
                  Show in sidebar &rarr;
                </button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
              {bookmarkedExercises.map((ex) => {
                const colors = CAT_COLORS[ex.category]
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onSelectExercise(ex)}
                    className={`shrink-0 w-56 text-left p-3 rounded-xl border border-yellow-500/25 ${colors.bg} hover:border-yellow-500/40 hover:scale-[1.02] transition-all snap-start`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-yellow-500/90 text-sm">★</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {CAT_NUMS[ex.category]}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-go-text leading-tight line-clamp-2">{ex.title}</div>
                    <div className="text-[11px] text-go-muted mt-1 truncate">{ex.category}</div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ── B. Category Progress Grid ────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-go-muted uppercase tracking-wider mb-3">Category Progress</h2>
          <div className="grid grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat}
                cat={cat}
                exercises={exercises.filter((e) => e.category === cat)}
                status={status}
                onClick={() => onFilterCategory(cat)}
              />
            ))}
          </div>
        </section>

        {/* ── C. Skill tree (React Flow + dagre) ─────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-go-muted uppercase tracking-wider mb-3">Skill Tree</h2>
          <div className="text-xs text-go-muted mb-2">
            <span className="inline-flex items-center gap-1 mr-3">
              <span className="inline-block w-2 h-2 rounded-full bg-go-success"></span> Completed
            </span>
            <span className="inline-flex items-center gap-1 mr-3">
              <span className="inline-block w-2 h-2 rounded-full bg-go-blue"></span> Available
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-500 ring-2 ring-slate-300/90"></span> Locked
            </span>
          </div>
          <SkillTreeFlow
            exercises={exercises}
            status={status}
            bookmarks={progress.bookmarks}
            catColors={CAT_COLORS}
            onSelectExercise={onSelectExercise}
          />
        </section>

        {/* ── D. Ready to Learn ────────────────────────────────────────── */}
        {availableExercises.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-go-muted uppercase tracking-wider mb-3">
              Ready to Learn
              <span className="ml-2 text-go-blue font-normal normal-case">
                {availableExercises.length} exercises unlocked
              </span>
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
              {availableExercises.map((ex) => (
                <ReadyCard
                  key={ex.id}
                  exercise={ex}
                  status={status}
                  exercises={exercises}
                  requires={ex.requires ?? []}
                  progress={progress}
                  onSelect={() => onSelectExercise(ex)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {availableExercises.length === 0 && completedCount === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🥋</div>
            <div className="text-go-text font-semibold mb-1">Ready to begin your Go journey?</div>
            <div className="text-go-muted text-sm mb-4">Start with the Basics category to unlock more exercises.</div>
            <button
              onClick={() => {
                const first = exercises.find((e) => status[e.id] === 'available')
                if (first) onSelectExercise(first)
              }}
              className="px-5 py-2 bg-go-blue hover:bg-go-cyan text-white font-semibold rounded-lg transition-all text-sm"
            >
              Start Learning &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
