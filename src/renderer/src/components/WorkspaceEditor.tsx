import React, { useRef, useEffect, useState, useCallback } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { WorkspaceFile } from '../types'

interface Props {
  files: WorkspaceFile[]
  activeFile: string | null
  onSelectFile: (name: string) => void
  getFileContent: (name: string) => string
  onFileChange: (name: string, content: string) => void
  onCreateFile: (name: string) => void
  onDeleteFile: (name: string) => void
  onRenameFile: (oldName: string, newName: string) => void
  onOpenInFinder: () => void
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

export default function WorkspaceEditor({
  files,
  activeFile,
  onSelectFile,
  getFileContent,
  onFileChange,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onOpenInFinder,
  editorRef,
}: Props) {
  const monacoRef = useRef<any>(null)
  const [themeName, setThemeName] = useState(currentTheme())
  const [fontFamily, setFontFamily] = useState(currentFont())
  const [showNewFile, setShowNewFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [renamingFile, setRenamingFile] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [contextMenu, setContextMenu] = useState<{ file: string; x: number; y: number } | null>(null)
  const newFileInputRef = useRef<HTMLInputElement>(null)
  const renameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).MonacoEnvironment = {
        getWorkerUrl: function () {
          return 'data:text/javascript;charset=utf-8,' + encodeURIComponent('self.MonacoEnvironment={};')
        },
      }
    }
  }, [])

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

  useEffect(() => {
    if (showNewFile && newFileInputRef.current) newFileInputRef.current.focus()
  }, [showNewFile])

  useEffect(() => {
    if (renamingFile && renameInputRef.current) renameInputRef.current.focus()
  }, [renamingFile])

  useEffect(() => {
    if (contextMenu) {
      const dismiss = () => setContextMenu(null)
      window.addEventListener('click', dismiss)
      return () => window.removeEventListener('click', dismiss)
    }
  }, [contextMenu])

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

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
      },
    })
    monaco.editor.defineTheme('go-dojo-paper', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7a6f52', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0c5a7a', fontStyle: 'bold' },
        { token: 'string', foreground: 'a0502d' },
        { token: 'number', foreground: '5a6f2d' },
        { token: 'type', foreground: '175a7a' },
        { token: 'function', foreground: '7a5a1a' },
        { token: 'variable', foreground: '2e3a50' },
        { token: 'operator', foreground: '3a2e1a' },
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
      },
    })
    monaco.editor.setTheme(themeName)
    setTimeout(() => {
      editor.focus()
      editor.layout()
    }, 100)
  }

  const activeFileObj = files.find((f) => f.name === activeFile)
  const isReadOnly = activeFileObj?.isReadOnly ?? false
  const code = activeFile ? getFileContent(activeFile) : ''

  const userFiles = files.filter((f) => !f.isReadOnly).sort((a, b) => a.name.localeCompare(b.name))
  const testFiles = files.filter((f) => f.isReadOnly).sort((a, b) => a.name.localeCompare(b.name))

  const handleNewFile = useCallback(() => {
    const name = newFileName.trim()
    if (!name) return
    const finalName = name.endsWith('.go') ? name : name + '.go'
    onCreateFile(finalName)
    setShowNewFile(false)
    setNewFileName('')
  }, [newFileName, onCreateFile])

  const handleRename = useCallback(() => {
    if (!renamingFile) return
    const name = renameValue.trim()
    if (!name || name === renamingFile) {
      setRenamingFile(null)
      return
    }
    const finalName = name.endsWith('.go') ? name : name + '.go'
    onRenameFile(renamingFile, finalName)
    setRenamingFile(null)
    setRenameValue('')
  }, [renamingFile, renameValue, onRenameFile])

  return (
    <div className="h-full w-full flex flex-col bg-go-dark">
      {/* File tabs */}
      <div className="h-9 flex items-center bg-go-surface/50 border-b border-go-border text-xs shrink-0 overflow-x-auto">
        <div className="flex items-center flex-1 min-w-0 overflow-x-auto scrollbar-hide">
          {userFiles.map((f) => (
            <button
              key={f.name}
              onClick={() => onSelectFile(f.name)}
              onContextMenu={(e) => {
                e.preventDefault()
                setContextMenu({ file: f.name, x: e.clientX, y: e.clientY })
              }}
              className={`inline-flex items-center gap-1.5 px-3 h-9 border-r border-go-border/50 whitespace-nowrap transition-colors ${
                activeFile === f.name
                  ? 'bg-go-dark text-go-text border-b-2 border-b-go-blue'
                  : 'text-go-muted hover:text-go-text hover:bg-go-surface/80'
              }`}
            >
              <span className="text-go-blue font-mono text-[10px]">GO</span>
              {f.name}
            </button>
          ))}
          {testFiles.map((f) => (
            <button
              key={f.name}
              onClick={() => onSelectFile(f.name)}
              className={`inline-flex items-center gap-1.5 px-3 h-9 border-r border-go-border/50 whitespace-nowrap transition-colors ${
                activeFile === f.name
                  ? 'bg-go-dark text-go-muted/80 border-b-2 border-b-go-muted/40'
                  : 'text-go-muted/50 hover:text-go-muted hover:bg-go-surface/80'
              }`}
            >
              <span className="font-mono text-[10px] text-go-muted/40">TEST</span>
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 px-2 shrink-0">
          {showNewFile ? (
            <form
              onSubmit={(e) => { e.preventDefault(); handleNewFile() }}
              className="flex items-center gap-1"
            >
              <input
                ref={newFileInputRef}
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={() => { if (!newFileName.trim()) setShowNewFile(false) }}
                onKeyDown={(e) => { if (e.key === 'Escape') setShowNewFile(false) }}
                placeholder="filename.go"
                className="w-28 px-1.5 py-0.5 bg-go-darker border border-go-blue/40 rounded text-xs text-go-text focus:outline-none focus:border-go-blue"
              />
            </form>
          ) : (
            <button
              onClick={() => setShowNewFile(true)}
              className="px-1.5 py-0.5 text-go-muted hover:text-go-text hover:bg-go-surface2/60 rounded transition-colors"
              title="New file"
            >
              +
            </button>
          )}
          <button
            onClick={onOpenInFinder}
            className="px-1.5 py-0.5 text-go-muted hover:text-go-text hover:bg-go-surface2/60 rounded transition-colors text-[10px]"
            title="Open workspace folder"
          >
            ...
          </button>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-go-surface border border-go-border rounded-md shadow-xl py-1 min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              setRenamingFile(contextMenu.file)
              setRenameValue(contextMenu.file)
              setContextMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-go-text hover:bg-go-surface2 transition-colors"
          >
            Rename
          </button>
          <button
            onClick={() => {
              onDeleteFile(contextMenu.file)
              setContextMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-go-error hover:bg-go-error/10 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {/* Rename inline */}
      {renamingFile && (
        <div className="h-8 flex items-center gap-2 px-3 bg-go-surface/60 border-b border-go-border/50 text-xs">
          <span className="text-go-muted">Rename:</span>
          <form
            onSubmit={(e) => { e.preventDefault(); handleRename() }}
            className="flex items-center gap-1"
          >
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => { if (e.key === 'Escape') setRenamingFile(null) }}
              className="w-40 px-1.5 py-0.5 bg-go-darker border border-go-blue/40 rounded text-xs text-go-text focus:outline-none focus:border-go-blue"
            />
          </form>
        </div>
      )}

      {/* Read-only banner */}
      {isReadOnly && (
        <div className="h-6 flex items-center px-3 bg-amber-900/20 border-b border-amber-700/30 text-[10px] text-amber-400/80 shrink-0">
          Test file — read only
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0">
        {activeFile ? (
          <Editor
            key={activeFile}
            height="100%"
            width="100%"
            language="go"
            value={code}
            onChange={(val) => {
              if (!isReadOnly && activeFile) {
                onFileChange(activeFile, val || '')
              }
            }}
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
              readOnly: isReadOnly,
              domReadOnly: isReadOnly,
            }}
            theme={themeName}
            loading={<div className="text-go-muted">Loading...</div>}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-go-muted text-sm">
            No file selected
          </div>
        )}
      </div>
    </div>
  )
}
