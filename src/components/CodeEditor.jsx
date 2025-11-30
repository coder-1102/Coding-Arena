import { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

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
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1f3a',
      },
    })
    monaco.editor.setTheme('custom-dark')
  }

  return (
    <Editor
      height="420px"
      defaultLanguage="python"
      value={code}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 15,
        minimap: { enabled: false },
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  )
}

