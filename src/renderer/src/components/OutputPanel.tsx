import React from 'react'
import { RunResult } from '../types'

interface Props {
  output: RunResult | null
  running: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function OutputPanel({ output, running, collapsed = false, onToggleCollapse }: Props) {
  return (
    <div
      className={`flex flex-col border-t border-go-border min-h-0 ${
        collapsed ? 'shrink-0' : 'flex-1'
      }`}
    >
      <div className="h-9 flex items-center justify-between gap-2 px-3 bg-go-surface/30 text-xs text-go-muted shrink-0 border-b border-go-border/50">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-go-text">Output</span>
          {output && (
            <span
              className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold ${
                output.passed ? 'bg-go-success/20 text-go-success' : 'bg-go-error/20 text-go-error'
              }`}
            >
              {output.passed ? 'PASSED' : 'FAILED'}
            </span>
          )}
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="shrink-0 px-2 py-0.5 rounded text-[10px] text-go-muted hover:text-go-text hover:bg-go-surface2/60 transition-colors"
            title={collapsed ? 'Show test output' : 'Hide output (more space for code)'}
          >
            {collapsed ? '▼ Show' : '▲ Hide'}
          </button>
        )}
      </div>
      {!collapsed && (
      <div className="flex-1 min-h-0 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
        {running ? (
          <div className="flex items-center gap-2 text-go-muted animate-pulse">
            <span className="inline-block w-2 h-2 bg-go-blue rounded-full animate-bounce" />
            Running tests...
          </div>
        ) : output ? (
          <div className="animate-fade-in">
            {output.passed && (
              <div className="mb-3 p-3 bg-go-success/10 border border-go-success/20 rounded-lg">
                <div className="text-go-success font-semibold text-sm mb-1">
                  &#10003; All tests passed!
                </div>
                <div className="text-go-success/70 text-xs">
                  Great work! Move on to the next exercise.
                </div>
              </div>
            )}
            {output.error && !output.output && (
              <div className="mb-3 p-3 bg-go-error/10 border border-go-error/20 rounded-lg">
                <div className="text-go-error font-semibold text-sm mb-1">Error</div>
                <pre className="text-go-error/80 whitespace-pre-wrap break-all">{output.error}</pre>
              </div>
            )}
            {output.output && (
              <pre className={`whitespace-pre-wrap break-all ${
                output.passed ? 'text-go-text' : 'text-go-error/90'
              }`}>
                {formatOutput(output.output)}
              </pre>
            )}
          </div>
        ) : (
          <div className="text-go-muted/50 text-center mt-8">
            <div className="text-2xl mb-2">&#9654;</div>
            <div>Press <kbd className="px-1.5 py-0.5 bg-go-surface rounded text-go-muted text-[10px]">Cmd+Enter</kbd> to run tests</div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}

function formatOutput(output: string): React.ReactNode {
  const lines = output.split('\n')
  return lines.map((line, i) => {
    let className = ''
    if (line.startsWith('--- PASS')) className = 'text-go-success font-semibold'
    else if (line.startsWith('--- FAIL')) className = 'text-go-error font-semibold'
    else if (line.startsWith('PASS')) className = 'text-go-success font-bold'
    else if (line.startsWith('FAIL')) className = 'text-go-error font-bold'
    else if (line.startsWith('=== RUN')) className = 'text-go-blue'
    else if (line.includes('PASS:')) className = 'text-go-success'
    else if (line.includes('FAIL:') || line.includes('Error')) className = 'text-go-error'

    return (
      <div key={i} className={className}>
        {line}
      </div>
    )
  })
}
