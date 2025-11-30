import { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { Box } from '@mui/material'

export default function CodeEditor({ code, onChange, onRun }) {
  const editorRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        onRun()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onRun])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    monaco.editor.defineTheme('premium-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#0a0a0a',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editorCursor.foreground': '#4F8BFF',
        'editorWhitespace.foreground': '#3B3A32',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#C6C6C6',
        'editorGutter.background': '#000000',
        'editorWidget.background': '#1E1E1E',
        'editorWidget.border': '#454545',
        'editorSuggestWidget.background': '#1E1E1E',
        'editorSuggestWidget.border': '#454545',
        'editorSuggestWidget.selectedBackground': '#264F78',
      },
    })
    monaco.editor.setTheme('premium-dark')
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 300px)',
        minHeight: '600px',
        position: 'relative',
      }}
    >
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 16,
          lineHeight: 24,
          minimap: { enabled: false },
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
          fontLigatures: true,
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: true,
        }}
      />
    </Box>
  )
}

