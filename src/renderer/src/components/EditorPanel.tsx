import React, { useRef, useEffect, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'

interface Props {
  code: string
  onChange: (code: string) => void
  editorRef: React.MutableRefObject<any>
}

function currentTheme(): 'go-dojo' | 'go-dojo-paper' {
  return document.body.classList.contains('theme-paper') ? 'go-dojo-paper' : 'go-dojo'
}
function currentFont(): string {
  return document.body.classList.contains('font-dyslexic')
    ? "'Lexend', 'Atkinson Hyperlegible', 'JetBrains Mono', monospace"
    : "'JetBrains Mono', 'Fira Code', monospace"
}

export default function EditorPanel({ code, onChange, editorRef }: Props) {
  const monacoRef = useRef<any>(null)
  const [themeName, setThemeName] = useState(currentTheme())
  const [fontFamily, setFontFamily] = useState(currentFont())

  useEffect(() => {
    // Configure Monaco environment for Electron
    if (typeof window !== 'undefined') {
      (window as any).MonacoEnvironment = {
        getWorkerUrl: function(moduleId: string, label: string) {
          return 'data:text/javascript;charset=utf-8,' + encodeURIComponent('self.MonacoEnvironment={};')
        }
      }
    }
  }, [])

  // Watch body class changes to refresh editor theme/font
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setThemeName(currentTheme())
      setFontFamily(currentFont())
    })
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const m = monacoRef.current
    if (m) m.editor.setTheme(themeName)
  }, [themeName])

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Dark theme
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
    // Paper theme — warm off-white, low-glare
    monaco.editor.defineTheme('go-dojo-paper', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7a6f52', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0c5a7a', fontStyle: 'bold' },
        { token: 'string',  foreground: 'a0502d' },
        { token: 'number',  foreground: '5a6f2d' },
        { token: 'type',    foreground: '175a7a' },
        { token: 'function',foreground: '7a5a1a' },
        { token: 'variable',foreground: '2e3a50' },
        { token: 'operator',foreground: '3a2e1a' },
      ],
      colors: {
        'editor.background': '#f9f4e7',
        'editor.foreground': '#2e281c',
        'editor.lineHighlightBackground': '#ede3c6',
        'editor.selectionBackground': '#d8c89a',
        'editorLineNumber.foreground': '#b4a47a',
        'editorLineNumber.activeForeground': '#0c5a7a',
        'editor.inactiveSelectionBackground': '#ede3c6',
        'editorIndentGuide.background': '#d8c89a',
        'editorCursor.foreground': '#0c5a7a',
        'editorWhitespace.foreground': '#d8c89a',
      }
    })
    monaco.editor.setTheme(themeName)

    // Focus and layout
    setTimeout(() => {
      editor.focus()
      editor.layout()
    }, 100)
  }

  return (
    <div className="h-full w-full flex flex-col bg-go-dark">
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
            fontFamily: fontFamily,
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
          theme={themeName}
          loading={<div className="text-go-muted">Loading...</div>}
        />
      </div>
    </div>
  )
}
