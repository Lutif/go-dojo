import React from 'react'
import { Exercise, Category, ProgressData } from '../types'

interface Props {
  completedCount: number
  totalCount: number
  categories: { name: Category; count: number }[]
  progress: ProgressData
  exercises: Exercise[]
  onSelectExercise: (e: Exercise) => void
  onFilterCategory: (c: Category) => void
}

const categoryDescriptions: Record<string, string> = {
  'Basics': 'Variables, types, functions, control flow, data structures',
  'Type System': 'Interfaces, generics, embedding, type assertions',
  'Error Handling': 'Errors, panic/recover, defer, error wrapping',
  'Concurrency': 'Goroutines, channels, sync primitives, patterns',
  'Standard Library': 'io, net/http, encoding, testing, time',
  'Patterns': 'Design patterns, idioms, best practices',
  'Internals': 'Memory model, GC, scheduler, unsafe, reflection',
  'Networking': 'TCP/UDP, HTTP, gRPC, WebSocket, TLS',
  'Data & Storage': 'SQL, KV stores, B-trees, caching',
  'Projects': 'CLI tools, APIs, compilers, distributed systems',
}

const categoryColors: Record<string, string> = {
  'Basics': 'from-green-500/20 to-green-600/5 border-green-500/30',
  'Type System': 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
  'Error Handling': 'from-red-500/20 to-red-600/5 border-red-500/30',
  'Concurrency': 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
  'Standard Library': 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
  'Patterns': 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
  'Internals': 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
  'Networking': 'from-pink-500/20 to-pink-600/5 border-pink-500/30',
  'Data & Storage': 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
  'Projects': 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
}

export default function WelcomeScreen({
  completedCount, totalCount, categories, progress, exercises,
  onSelectExercise, onFilterCategory
}: Props) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Find first incomplete exercise
  const nextExercise = exercises.find((e) => !progress.completed[e.id])

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl font-bold text-go-blue font-mono">Go</span>
            <span className="text-5xl font-bold text-go-text">Dojo</span>
          </div>
          <p className="text-go-muted text-lg max-w-2xl mx-auto">
            Master Go from zero to senior level. {totalCount} exercises covering syntax, patterns,
            internals, and real-world projects.
          </p>

          {/* Overall progress */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-go-muted mb-2">
              <span>{completedCount} of {totalCount} exercises completed</span>
              <span>{pct}%</span>
            </div>
            <div className="h-3 bg-go-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-go-blue to-go-cyan rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Start button */}
          {nextExercise && (
            <button
              onClick={() => onSelectExercise(nextExercise)}
              className="mt-6 px-6 py-3 bg-go-blue hover:bg-go-cyan text-white font-semibold rounded-lg transition-all pulse-glow text-sm"
            >
              {completedCount > 0 ? 'Continue Learning' : 'Start Learning'} &rarr;
            </button>
          )}
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => {
            const catExercises = exercises.filter((e) => e.category === cat.name)
            const catCompleted = catExercises.filter((e) => progress.completed[e.id]).length
            const catPct = cat.count > 0 ? Math.round((catCompleted / cat.count) * 100) : 0
            const colors = categoryColors[cat.name] || 'from-gray-500/20 to-gray-600/5 border-gray-500/30'

            return (
              <button
                key={cat.name}
                onClick={() => {
                  const first = catExercises.find((e) => !progress.completed[e.id]) || catExercises[0]
                  if (first) onSelectExercise(first)
                }}
                className={`text-left p-5 rounded-xl bg-gradient-to-br ${colors} border hover:scale-[1.02] transition-all group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-go-text group-hover:text-go-blue transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-go-muted">
                    {catCompleted}/{cat.count}
                  </span>
                </div>
                <p className="text-xs text-go-muted mb-3">
                  {categoryDescriptions[cat.name]}
                </p>
                <div className="h-1.5 bg-go-darker/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-go-blue/60 rounded-full transition-all duration-500"
                    style={{ width: `${catPct}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Info */}
        <div className="mt-12 text-center text-go-muted/50 text-xs space-y-1">
          <p>Keyboard shortcuts: Cmd+Enter (run) &middot; Cmd+R (reset)</p>
          <p>Requires Go installed on your system</p>
        </div>
      </div>
    </div>
  )
}
