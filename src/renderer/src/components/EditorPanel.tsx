import React, { useRef, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'

interface Props {
  code: string
  onChange: (code: string) => void
  editorRef: React.MutableRefObject<any>
}

export default function EditorPanel({ code, onChange, editorRef }: Props) {
  useEffect(() => {
    // Configure Monaco environment for Electron
    if (typeof window !== 'undefined') {
      (window as any).MonacoEnvironment = {
        getWorkerUrl: function(moduleId: string, label: string) {
          // Return empty function for workers - they'll run inline
          return 'data:text/javascript;charset=utf-8,' + encodeURIComponent('self.MonacoEnvironment={};')
        }
      }
    }
  }, [])

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    console.log('Editor mounted')

    // Configure theme
    monaco.editor.defineTheme('go-dojo', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '546E7A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00ADD8', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '5DC9E2' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'operator', foreground: 'D4D4D4' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1a2332',
        'editor.selectionBackground': '#264f78',
        'editorLineNumber.foreground': '#3d5a6e',
        'editorLineNumber.activeForeground': '#5DC9E2',
        'editor.inactiveSelectionBackground': '#1a2332',
        'editorIndentGuide.background': '#1e2d3d',
        'editorCursor.foreground': '#00ADD8',
        'editorWhitespace.foreground': '#1e2d3d',
      }
    })
    monaco.editor.setTheme('go-dojo')

    // Focus and layout
    setTimeout(() => {
      editor.focus()
      editor.layout()
    }, 100)
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#0d1117]">
      <div className="h-8 flex items-center px-4 bg-go-surface/50 border-b border-go-border text-xs text-go-muted shrink-0">
        <span className="text-go-blue font-mono mr-2">&#9679;</span>
        exercise.go
        <span className="ml-auto opacity-50">Cmd+Enter to run &middot; Cmd+R to reset</span>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          width="100%"
          language="go"
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on',
            tabSize: 4,
            insertSpaces: false,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            automaticLayout: true,
            suggest: { showKeywords: true },
            glyphMargin: false,
            domReadOnly: false,
            readOnly: false,
          }}
          theme="go-dojo"
          loading={<div className="text-go-muted">Loading...</div>}
        />
      </div>
    </div>
  )
}
