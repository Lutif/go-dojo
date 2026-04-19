import React from 'react'
import { Exercise, ExerciseStatus } from '../types'

interface Props {
  exercise: Exercise
  showHints: boolean
  hintIndex: number
  showSolution: boolean
  status: Record<string, ExerciseStatus>
  allExercises: Exercise[]
  onNextHint: () => void
  onSelectExercise: (e: Exercise) => void
}

export default function ExerciseInfo({
  exercise, showHints, hintIndex, showSolution,
  status, allExercises, onNextHint, onSelectExercise
}: Props) {
  const prereqs = exercise.requires ?? []
  const prereqHints = exercise.prereqHints ?? []

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-4">
        {/* Project step banner */}
        {exercise.step && exercise.totalSteps && (
          <div className="mb-3 p-2.5 bg-go-blue/10 border border-go-blue/20 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-go-blue text-xs font-semibold">{exercise.projectTitle}</span>
              <span className="text-go-muted text-[10px]">Step {exercise.step} of {exercise.totalSteps}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: exercise.totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    i + 1 < exercise.step
                      ? 'bg-go-success'
                      : i + 1 === exercise.step
                      ? 'bg-go-blue'
                      : 'bg-go-surface2'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites section */}
        {prereqs.length > 0 && (
          <div className="mb-3 p-2.5 bg-go-surface/60 border border-go-border/60 rounded-lg">
            <div className="text-xs font-semibold text-go-muted uppercase tracking-wider mb-2">Prerequisites</div>
            <div className="space-y-1">
              {prereqs.map((reqId) => {
                const reqEx = allExercises.find((e) => e.id === reqId)
                const reqStatus = status[reqId]
                const done = reqStatus === 'completed'
                return (
                  <button
                    key={reqId}
                    onClick={() => {
                      if (reqEx) onSelectExercise(reqEx)
                    }}
                    className="w-full text-left flex items-center gap-2 hover:bg-go-surface2/50 px-1.5 py-1 rounded transition-colors"
                  >
                    <span className={`text-xs font-bold w-4 shrink-0 ${done ? 'text-go-success' : 'text-go-muted'}`}>
                      {done ? '✓' : '○'}
                    </span>
                    <span className={`text-xs ${done ? 'text-go-success' : 'text-go-text/60'}`}>
                      {reqEx?.title ?? reqId}
                    </span>
                    {!done && (
                      <span className="text-[10px] text-go-blue ml-auto">View →</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Category breadcrumb */}
        <div className="text-xs text-go-muted mb-2">
          {exercise.category} &rsaquo; {exercise.subcategory}
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-go-text mb-1">{exercise.title}</h1>

        {/* Description */}
        <div
          className="exercise-description text-sm text-go-text/80 mt-3"
          dangerouslySetInnerHTML={{ __html: formatDescription(exercise.description) }}
        />

        {/* Hints */}
        {showHints && exercise.hints.length > 0 && (
          <div className="mt-4 p-3 bg-go-warning/10 border border-go-warning/20 rounded-lg animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-go-warning font-semibold text-sm">
                Hint {hintIndex + 1}/{exercise.hints.length}
              </span>
              {hintIndex < exercise.hints.length - 1 && (
                <button
                  onClick={onNextHint}
                  className="text-xs text-go-warning hover:text-go-warning/80 transition-colors"
                >
                  Next hint &rarr;
                </button>
              )}
            </div>
            <div className="text-sm text-go-text/80">
              {exercise.hints[hintIndex]}
            </div>
            {/* Prereq hints for this hint index */}
            {prereqHints.length > 0 && (
              <div className="mt-2 space-y-1 border-t border-go-warning/10 pt-2">
                {prereqHints.map((ph, i) => {
                  const phEx = allExercises.find((e) => e.id === ph.exerciseId)
                  return (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-go-muted">
                      <span className="text-go-blue shrink-0 mt-0.5">→</span>
                      <span>{ph.text}</span>
                      {phEx && (
                        <button
                          onClick={() => onSelectExercise(phEx)}
                          className="text-go-blue hover:text-go-cyan shrink-0 ml-auto transition-colors"
                        >
                          {ph.exerciseTitle} →
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="mt-4 p-3 bg-go-blue/10 border border-go-blue/20 rounded-lg animate-fade-in">
            <div className="text-go-blue font-semibold text-sm mb-2">Solution</div>
            <pre className="text-xs text-go-text/90 font-mono whitespace-pre-wrap overflow-x-auto bg-go-darker/50 p-3 rounded">
              {exercise.solution}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDescription(desc: string): string {
  // Simple markdown-like formatting
  let html = desc
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br/>')

  // Wrap list items
  html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>')

  return `<p>${html}</p>`
}
