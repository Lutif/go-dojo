import React, { useState } from 'react'
import { Exercise, Category, ProgressData, ExerciseStatus } from '../types'

interface Props {
  exercises: Exercise[]
  categories: { name: Category; count: number }[]
  selectedExercise: Exercise | null
  progress: ProgressData
  status: Record<string, ExerciseStatus>
  filterCategory: Category | 'all' | 'bookmarks'
  searchQuery: string
  collapsed: boolean
  completedCount: number
  totalCount: number
  onSelectExercise: (e: Exercise) => void
  onFilterCategory: (c: Category | 'all') => void
  onSearchQuery: (q: string) => void
  onToggleCollapse: () => void
  onGoToDashboard: () => void
}

const categoryIcons: Record<string, string> = {
  'Basics': '01', 'Type System': '02', 'Error Handling': '03',
  'Concurrency': '04', 'Standard Library': '05', 'Patterns': '06',
  'Internals': '07', 'Networking': '08', 'Data & Storage': '09', 'Projects': '10',
}

// ── helper: group project exercises by projectId ──────────────────────────
interface ProjectGroup {
  projectId: string
  projectTitle: string
  steps: Exercise[]
}

function groupByProject(exercises: Exercise[]): Array<Exercise | ProjectGroup> {
  const result: Array<Exercise | ProjectGroup> = []
  const projectMap = new Map<string, ProjectGroup>()

  for (const ex of exercises) {
    if (ex.projectId) {
      if (!projectMap.has(ex.projectId)) {
        const group: ProjectGroup = {
          projectId: ex.projectId,
          projectTitle: ex.projectTitle ?? ex.projectId,
          steps: [],
        }
        projectMap.set(ex.projectId, group)
        result.push(group)
      }
      projectMap.get(ex.projectId)!.steps.push(ex)
    } else {
      result.push(ex)
    }
  }

  return result
}

function isProjectGroup(item: Exercise | ProjectGroup): item is ProjectGroup {
  return 'steps' in item
}

// ── ProjectRow — expandable project with step list ────────────────────────
function ProjectRow({
  group,
  selectedExercise,
  progress,
  bookmarks,
  status,
  onSelectExercise,
}: {
  group: ProjectGroup
  selectedExercise: Exercise | null
  progress: ProgressData
  bookmarks: Record<string, boolean>
  status: Record<string, ExerciseStatus>
  onSelectExercise: (e: Exercise) => void
}) {
  const completed = group.steps.filter((s) => progress.completed[s.id]).length
  const total = group.steps.length
  const allDone = completed === total
  const isActive = group.steps.some((s) => s.id === selectedExercise?.id)
  const [open, setOpen] = useState(isActive || completed > 0)

  return (
    <div className={`border-l-2 ml-2 mb-1 ${isActive ? 'border-go-blue' : 'border-go-border/30'}`}>
      {/* Project header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-go-surface2/40 transition-all ${
          isActive ? 'bg-go-surface2/30' : ''
        }`}
      >
        <span className="text-go-muted text-[10px] w-3 shrink-0">{open ? '▾' : '▸'}</span>
        <span className={`flex-1 text-xs font-semibold truncate ${allDone ? 'text-go-success' : isActive ? 'text-go-blue' : 'text-go-text/70'}`}>
          {group.projectTitle}
        </span>
        <span className={`text-[10px] shrink-0 px-1.5 py-0.5 rounded-full ${
          allDone ? 'bg-go-success/20 text-go-success' : 'bg-go-surface text-go-muted'
        }`}>
          {completed}/{total}
        </span>
      </button>

      {/* Steps */}
      {open && (
        <div className="pb-1">
          {group.steps.map((ex) => {
            const done = !!progress.completed[ex.id]
            const active = selectedExercise?.id === ex.id
            const exStatus = status[ex.id] ?? 'available'
            const locked = exStatus === 'locked'

            return (
              <button
                key={ex.id}
                onClick={() => onSelectExercise(ex)}
                disabled={locked}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 transition-all ${
                  locked ? 'cursor-not-allowed' : 'hover:bg-go-surface2/50'
                } ${active ? 'bg-go-surface2 border-r-2 border-go-blue' : ''}`}
              >
                {/* Step indicator */}
                <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                  done
                    ? 'bg-go-success text-white'
                    : locked
                    ? 'bg-transparent border-2 border-dashed border-go-muted/60 text-go-muted/70'
                    : active
                    ? 'bg-go-blue/20 border-2 border-go-blue text-go-blue'
                    : 'bg-go-surface border-2 border-go-border text-go-muted'
                }`}>
                  {done ? '✓' : locked ? '⌀' : ex.step}
                </span>
                <span className={`text-xs truncate ${
                  active ? 'text-go-text' :
                  done ? 'text-go-muted' :
                  locked ? 'text-go-muted/50' :
                  'text-go-text/60'
                }`}>
                  Step {ex.step}: {ex.title.replace(/^.*?—\s*/, '')}
                </span>
                {bookmarks[ex.id] && (
                  <span className="text-[10px] text-yellow-500/90 shrink-0" title="Bookmarked">★</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({
  exercises, categories, selectedExercise, progress, status,
  filterCategory, searchQuery, collapsed,
  completedCount, totalCount,
  onSelectExercise, onFilterCategory, onSearchQuery, onToggleCollapse, onGoToDashboard,
}: Props) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const bookmarks = progress.bookmarks ?? {}
  const bookmarkCount = Object.keys(bookmarks).filter((id) => bookmarks[id]).length

  // Group exercises by category first
  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = []
    acc[ex.category].push(ex)
    return acc
  }, {})

  if (collapsed) {
    return (
      <div className="w-12 bg-go-darker border-r border-go-border flex flex-col items-center py-4 shrink-0">
        <button onClick={onToggleCollapse} className="text-go-muted hover:text-go-blue transition-colors mb-2 text-lg" title="Expand sidebar">
          &#9776;
        </button>
        <button
          onClick={onGoToDashboard}
          title="Progress Dashboard"
          className={`w-8 h-8 rounded flex items-center justify-center mb-3 transition-all text-base ${
            !selectedExercise
              ? 'bg-go-blue/20 text-go-blue'
              : 'text-go-muted hover:text-go-blue hover:bg-go-surface2'
          }`}
        >
          ⬡
        </button>
        <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto">
          {categories.map((cat) => {
            const catDone = exercises.filter((e) => e.category === cat.name && progress.completed[e.id]).length
            const allDone = catDone === cat.count && cat.count > 0
            return (
              <button
                key={cat.name}
                onClick={() => { onFilterCategory(cat.name); onToggleCollapse() }}
                className={`w-8 h-8 rounded text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  allDone ? 'bg-go-success/20 text-go-success' : 'bg-go-surface text-go-muted hover:text-go-blue hover:bg-go-surface2'
                }`}
                title={cat.name}
              >
                {categoryIcons[cat.name]}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 bg-go-darker border-r border-go-border flex flex-col shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-go-border">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onGoToDashboard}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Go to Progress Dashboard"
          >
            <span className="text-go-blue font-bold text-lg font-mono">Go</span>
            <span className="text-go-text font-bold text-lg">Dojo</span>
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onGoToDashboard}
              title="Progress Dashboard"
              className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all ${
                !selectedExercise
                  ? 'bg-go-blue/20 text-go-blue'
                  : 'text-go-muted hover:text-go-blue hover:bg-go-surface2'
              }`}
            >
              ⬡
            </button>
            <button onClick={onToggleCollapse} className="text-go-muted hover:text-go-blue transition-colors text-sm w-7 h-7 flex items-center justify-center" title="Collapse sidebar">
              &#9776;
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-go-muted mb-1">
            <span>{completedCount}/{totalCount} exercises</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-go-surface rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-go-blue to-go-cyan rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => onSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-go-surface border border-go-border rounded-md text-sm text-go-text placeholder-go-muted/50 focus:outline-none focus:border-go-blue/50 transition-colors"
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            onClick={() => onFilterCategory('all')}
            className={`px-2 py-0.5 text-xs rounded transition-all ${filterCategory === 'all' ? 'bg-go-blue text-white' : 'bg-go-surface text-go-muted hover:text-go-text'}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterCategory('bookmarks')}
            title="Bookmarked exercises"
            className={`px-2 py-0.5 text-xs rounded transition-all ${
              filterCategory === 'bookmarks'
                ? 'bg-yellow-600/90 text-white'
                : 'bg-go-surface text-go-muted hover:text-yellow-400/90'
            }`}
          >
            ★ {bookmarkCount > 0 ? bookmarkCount : ''}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onFilterCategory(cat.name)}
              className={`px-2 py-0.5 text-xs rounded transition-all ${filterCategory === cat.name ? 'bg-go-blue text-white' : 'bg-go-surface text-go-muted hover:text-go-text'}`}
            >
              {categoryIcons[cat.name]}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto">
        {filterCategory === 'bookmarks' && bookmarkCount === 0 && (
          <div className="px-4 py-8 text-center text-go-muted text-sm">
            <div className="text-2xl mb-2 opacity-60">☆</div>
            <p>No bookmarks yet.</p>
            <p className="text-xs mt-1 text-go-muted/70">Open an exercise and click the star in the header to save it here.</p>
          </div>
        )}
        {Object.entries(grouped).map(([category, exs]) => {
          const catDone = exs.filter((e) => progress.completed[e.id]).length
          const items = groupByProject(exs)

          return (
            <div key={category} className="border-b border-go-border/50">
              {/* Category header */}
              <div className="px-4 py-2 text-xs font-semibold text-go-muted uppercase tracking-wider bg-go-surface/30 sticky top-0 z-10">
                {categoryIcons[category]} · {category}
                <span className="float-right font-normal">{catDone}/{exs.length}</span>
              </div>

              {/* Items: either plain exercises or grouped project steps */}
              <div className="py-1">
                {items.map((item) => {
                  if (isProjectGroup(item)) {
                    return (
                      <ProjectRow
                        key={item.projectId}
                        group={item}
                        selectedExercise={selectedExercise}
                        progress={progress}
                        bookmarks={bookmarks}
                        status={status}
                        onSelectExercise={onSelectExercise}
                      />
                    )
                  }
                  // Plain exercise
                  const ex = item
                  const done = !!progress.completed[ex.id]
                  const active = selectedExercise?.id === ex.id
                  const exStatus = status[ex.id] ?? 'available'
                  const locked = exStatus === 'locked'

                  return (
                    <button
                      key={ex.id}
                      onClick={() => onSelectExercise(ex)}
                      disabled={locked}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-all ${
                        locked ? 'cursor-not-allowed' : 'hover:bg-go-surface2/50'
                      } ${active ? 'bg-go-surface2 border-l-2 border-go-blue' : 'border-l-2 border-transparent'}`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                        done
                          ? 'bg-go-success text-white'
                          : locked
                          ? 'bg-transparent border-2 border-dashed border-go-muted/70 text-go-muted/70'
                          : exStatus === 'available'
                          ? 'bg-go-blue/10 border-2 border-go-blue/60 text-go-blue'
                          : 'bg-go-surface border-2 border-go-border text-go-muted'
                      }`}>
                        {done ? '✓' : ''}
                      </span>
                      <span className={`truncate ${
                        active ? 'text-go-text' :
                        locked ? 'text-go-muted/50' :
                        exStatus === 'available' ? 'text-go-text/80' :
                        'text-go-muted'
                      }`}>
                        {ex.title}
                      </span>
                      <span className="ml-auto flex items-center gap-1 shrink-0">
                        {bookmarks[ex.id] && (
                          <span className="text-[11px] text-yellow-500/90" title="Bookmarked">
                            ★
                          </span>
                        )}
                        {locked && (
                          <span className="text-[11px] text-go-muted/60">🔒</span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
