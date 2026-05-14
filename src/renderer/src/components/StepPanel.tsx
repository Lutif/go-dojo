import React, { useRef, useEffect } from 'react'
import { ProjectStep, ProgressData, RunResult } from '../types'

interface Props {
  steps: ProjectStep[]
  activeStepId: string | null
  progress: ProgressData
  output: RunResult | null
  running: boolean
  showHints: boolean
  hintIndex: number
  showSolution: boolean
  onSelectStep: (step: ProjectStep) => void
  onNextHint: () => void
}

function stepStatus(
  step: ProjectStep,
  progress: ProgressData
): 'completed' | 'available' | 'locked' {
  if (progress.completed[step.id]) return 'completed'
  if (step.requires.length === 0) return 'available'
  const allMet = step.requires.every((reqId) => progress.completed[reqId])
  return allMet ? 'available' : 'locked'
}

export default function StepPanel({
  steps,
  activeStepId,
  progress,
  output,
  running,
  showHints,
  hintIndex,
  showSolution,
  onSelectStep,
  onNextHint,
}: Props) {
  const activeStep = steps.find((s) => s.id === activeStepId)
  const completedCount = steps.filter((s) => progress.completed[s.id]).length
  const activeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeStepId])

  return (
    <div className="h-full flex flex-col bg-go-darker/50 border-r border-go-border/50 overflow-hidden w-[380px] shrink-0">
      {/* Progress header */}
      <div className="h-9 flex items-center justify-between px-3 bg-go-surface/30 text-xs shrink-0 border-b border-go-border/50">
        <span className="font-semibold text-go-text">Guide</span>
        <span className="text-go-muted">
          {completedCount}/{steps.length} completed
        </span>
      </div>

      {/* Horizontal step track */}
      <div className="shrink-0 border-b border-go-border/50 bg-go-surface/20">
        <div ref={scrollRef} className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
          {steps.map((step, i) => {
            const st = stepStatus(step, progress)
            const active = activeStepId === step.id
            const done = st === 'completed'
            const locked = st === 'locked'

            return (
              <React.Fragment key={step.id}>
                {i > 0 && (
                  <div className={`w-4 h-px shrink-0 ${
                    done || (stepStatus(steps[i - 1], progress) === 'completed')
                      ? 'bg-go-success/40'
                      : 'bg-go-border/40'
                  }`} />
                )}
                <button
                  ref={active ? activeRef : undefined}
                  onClick={() => { if (!locked) onSelectStep(step) }}
                  disabled={locked}
                  title={locked ? `Locked — needs: ${step.requires.map(r => steps.find(s => s.id === r)?.title ?? r).join(', ')}` : step.title}
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    active
                      ? 'bg-go-blue text-white ring-2 ring-go-blue/40 ring-offset-1 ring-offset-go-darker'
                      : done
                      ? 'bg-go-success/80 text-white hover:bg-go-success'
                      : locked
                      ? 'bg-go-surface/50 text-go-muted/40 border border-dashed border-go-muted/30 cursor-not-allowed'
                      : 'bg-go-surface border border-go-border text-go-muted hover:border-go-blue/50 hover:text-go-text'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </button>
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Main scrollable content: step description + hints + solution + output */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeStep && (
          <div className="p-4 space-y-4">
            {/* Step title + difficulty */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-go-muted font-medium uppercase tracking-wider">
                  Step {steps.indexOf(activeStep) + 1} of {steps.length}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeStep.difficulty === 'beginner' ? 'bg-green-900/50 text-green-400' :
                  activeStep.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                  activeStep.difficulty === 'advanced' ? 'bg-orange-900/50 text-orange-400' :
                  'bg-red-900/50 text-red-400'
                }`}>
                  {activeStep.difficulty}
                </span>
                {progress.completed[activeStep.id] && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-go-success/15 text-go-success border border-go-success/25">
                    Completed
                  </span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-go-text">{activeStep.title}</h2>
            </div>

            {/* Description */}
            <div className="text-xs text-go-text/85 leading-relaxed whitespace-pre-wrap">
              {activeStep.description}
            </div>

            {/* Hints */}
            {showHints && activeStep.hints.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-go-muted uppercase tracking-wider">Hints</div>
                {activeStep.hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <div key={i} className="text-xs text-go-text/70 bg-go-surface/50 border border-go-border/50 rounded p-2.5 leading-relaxed">
                    {hint}
                  </div>
                ))}
                {hintIndex < activeStep.hints.length - 1 && (
                  <button
                    onClick={onNextHint}
                    className="text-[10px] text-go-blue hover:text-go-cyan transition-colors"
                  >
                    Show next hint ({hintIndex + 1}/{activeStep.hints.length})
                  </button>
                )}
              </div>
            )}

            {/* Solution */}
            {showSolution && (
              <div>
                <div className="text-[10px] font-semibold text-go-muted uppercase tracking-wider mb-2">Solution</div>
                <pre className="text-[11px] text-go-text/80 bg-go-surface/50 border border-go-border/50 rounded p-3 overflow-x-auto whitespace-pre leading-relaxed">
                  {activeStep.solution}
                </pre>
              </div>
            )}

            {/* Test output inline */}
            {(output || running) && (
              <div>
                <div className="text-[10px] font-semibold text-go-muted uppercase tracking-wider mb-2">Test Output</div>
                {running ? (
                  <div className="flex items-center gap-2 text-xs text-go-muted py-2">
                    <div className="inline-block w-3 h-3 border-2 border-go-blue border-t-transparent rounded-full animate-spin" />
                    Running tests...
                  </div>
                ) : output && (
                  <div className={`rounded border p-3 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap ${
                    output.passed
                      ? 'bg-go-success/10 border-go-success/30 text-go-success'
                      : 'bg-red-900/10 border-red-500/30 text-red-400'
                  }`}>
                    {output.passed && <div className="font-semibold mb-1">All tests passed!</div>}
                    {output.error && <div className="text-red-400">{output.error}</div>}
                    {output.output && <div className="text-go-text/70">{output.output}</div>}
                  </div>
                )}
              </div>
            )}

            {/* Step navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-go-border/30">
              {(() => {
                const idx = steps.indexOf(activeStep)
                const prev = idx > 0 ? steps[idx - 1] : null
                const next = idx < steps.length - 1 ? steps[idx + 1] : null
                const nextStatus = next ? stepStatus(next, progress) : 'locked'
                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => onSelectStep(prev)}
                        className="text-[11px] text-go-muted hover:text-go-text transition-colors"
                      >
                        &larr; {prev.title}
                      </button>
                    ) : <span />}
                    {next && nextStatus !== 'locked' ? (
                      <button
                        onClick={() => onSelectStep(next)}
                        className="text-[11px] text-go-blue hover:text-go-cyan transition-colors"
                      >
                        {next.title} &rarr;
                      </button>
                    ) : next ? (
                      <span className="text-[11px] text-go-muted/40">{next.title} (locked)</span>
                    ) : (
                      <span className="text-[11px] text-go-success">Final step!</span>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
