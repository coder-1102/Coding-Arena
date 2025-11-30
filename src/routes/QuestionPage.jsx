import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'
import { questions } from '../data/questions'
import Sidebar from '../components/Sidebar'
import CodeEditor from '../components/CodeEditor'
import TestcaseResult from '../components/TestcaseResult'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

let pyodideInstance = null

const loadPyodideInstance = async () => {
  if (!pyodideInstance) {
    // Load Pyodide from CDN to avoid bundling issues
    if (!window.loadPyodide) {
      // Load the Pyodide script if not already loaded
      await new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="pyodide"]')) {
          // Script already exists, wait for it to load
          const checkLoad = setInterval(() => {
            if (window.loadPyodide) {
              clearInterval(checkLoad)
              resolve()
            }
          }, 100)
          setTimeout(() => {
            clearInterval(checkLoad)
            reject(new Error('Pyodide script timeout'))
          }, 10000)
        } else {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        }
      })
    }
    
    // Now load Pyodide instance
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    })
  }
  return pyodideInstance
}

export default function QuestionPage() {
  const { id, qid } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [code, setCode] = useState('# Write your code here\n')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [solved, setSolved] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [progress, setProgress] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login')
        return
      }

      setUser(currentUser)

      const categoryQuestions = questions[id]
      if (!categoryQuestions) {
        navigate('/dashboard')
        return
      }

      const q = categoryQuestions.find(q => q.id === parseInt(qid))
      if (!q) {
        navigate('/dashboard')
        return
      }

      setQuestion(q)

      // Load saved code
      try {
        const codeDoc = await getDoc(doc(db, 'users', currentUser.uid, 'codes', qid))
        if (codeDoc.exists() && codeDoc.data().code) {
          setCode(codeDoc.data().code)
        }
      } catch (error) {
        console.error('Error loading code:', error)
      }

      // Load progress
      try {
        const progressDoc = await getDoc(doc(db, 'users', currentUser.uid, 'progress', id))
        if (progressDoc.exists()) {
          setProgress(progressDoc.data())
          setSolved(progressDoc.data().solved?.includes(parseInt(qid)) || false)
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    })

    return () => unsubscribe()
  }, [id, qid, navigate])

  const saveCode = async () => {
    if (!user) return

    try {
      await setDoc(doc(db, 'users', user.uid, 'codes', qid), {
        code,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error saving code:', error)
    }
  }

  const runCode = async (submit = false) => {
    if (!question) return

    setLoading(true)
    setResults([])

    // Save code
    await saveCode()

    try {
      // Try backend first
      const response = await fetch('http://localhost:5000/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          testcases: question.testcases,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results)

        if (submit) {
          const allPassed = data.results.every(r => r.passed)
          if (allPassed) {
            await markAsSolved()
            setSnackbar({
              open: true,
              message: 'All testcases passed! Question solved! 🎉',
              severity: 'success',
            })
          } else {
            setSnackbar({
              open: true,
              message: 'Some testcases failed. Try again!',
              severity: 'error',
            })
          }
        }
      } else {
        throw new Error('Backend error')
      }
    } catch (error) {
      // Fallback to Pyodide
      console.log('Backend unavailable, using Pyodide fallback')
      try {
        const pyodide = await loadPyodideInstance()
        const testResults = []

        for (const testcase of question.testcases) {
          try {
            // Set up input
            pyodide.runPython(`
import sys
from io import StringIO
sys.stdin = StringIO('''${testcase.input.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')
`)

            // Capture stdout
            pyodide.runPython(`
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = StringIO()
`)

            // Execute user code
            try {
              pyodide.runPython(code)
            } catch (execError) {
              testResults.push({
                passed: false,
                expected: testcase.output.trim(),
                got: `Error: ${execError.message}`,
              })
              continue
            }

            // Get output
            const output = pyodide.runPython('sys.stdout.getvalue()')
            pyodide.runPython('sys.stdout = old_stdout')

            const expected = testcase.output.trim()
            const got = String(output).trim()
            const passed = got === expected

            testResults.push({
              passed,
              expected,
              got,
            })
          } catch (err) {
            testResults.push({
              passed: false,
              expected: testcase.output.trim(),
              got: `Error: ${err.message}`,
            })
          }
        }

        setResults(testResults)

        if (submit) {
          const allPassed = testResults.every(r => r.passed)
          if (allPassed) {
            await markAsSolved()
            setSnackbar({
              open: true,
              message: 'All testcases passed! Question solved! 🎉',
              severity: 'success',
            })
          } else {
            setSnackbar({
              open: true,
              message: 'Some testcases failed. Try again!',
              severity: 'error',
            })
          }
        }
      } catch (pyodideError) {
        console.error('Pyodide error:', pyodideError)
        setSnackbar({
          open: true,
          message: 'Error executing code. Please check your syntax or ensure backend is running.',
          severity: 'error',
        })
        setResults([{
          passed: false,
          expected: 'N/A',
          got: `Execution Error: ${pyodideError.message}`,
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  const markAsSolved = async () => {
    if (!user) return

    try {
      const progressRef = doc(db, 'users', user.uid, 'progress', id)
      const progressDoc = await getDoc(progressRef)
      
      let solvedList = []
      if (progressDoc.exists()) {
        solvedList = progressDoc.data().solved || []
      }

      if (!solvedList.includes(parseInt(qid))) {
        solvedList.push(parseInt(qid))
      }

      const categoryQuestions = questions[id] || []
      const allSolved = categoryQuestions.every(q => solvedList.includes(q.id))

      await setDoc(progressRef, {
        unlocked: true,
        solved: solvedList,
        completed: allSolved,
      }, { merge: true })

      setSolved(true)
      setProgress({ ...progress, solved: solvedList, completed: allSolved })

      // Unlock next category if completed
      if (allSolved) {
        const categoryIndex = ['Basics', 'Lists', 'Strings', 'OOP', 'DSA'].indexOf(id)
        if (categoryIndex < 4) {
          const nextCategory = ['Basics', 'Lists', 'Strings', 'OOP', 'DSA'][categoryIndex + 1]
          await setDoc(doc(db, 'users', user.uid, 'progress', nextCategory), {
            unlocked: true,
            solved: [],
            completed: false,
          }, { merge: true })

          // Confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })

          setSnackbar({
            open: true,
            message: `Category completed! ${nextCategory} unlocked! 🎉`,
            severity: 'success',
          })
        }
      }
    } catch (error) {
      console.error('Error marking as solved:', error)
    }
  }

  if (!question) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#4F8BFF' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#0a0e27',
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/category/${id}`)}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Typography variant="h4" component="h1" sx={{ color: '#4F8BFF', fontWeight: 'bold', flex: 1 }}>
                {question.title}
                {solved && <CheckCircleIcon sx={{ ml: 2, color: '#4F8BFF', verticalAlign: 'middle' }} />}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#4F8BFF' }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                    {question.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" sx={{ mb: 2, color: '#4F8BFF' }}>
                    Constraints
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {question.constraints}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" sx={{ mb: 2, color: '#4F8BFF' }}>
                    Sample Input
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#1a1f3a', mb: 2 }}>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', margin: 0 }}>
                      {question.sampleInput || 'N/A'}
                    </Typography>
                  </Paper>

                  <Typography variant="h6" sx={{ mb: 2, color: '#4F8BFF' }}>
                    Sample Output
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#1a1f3a' }}>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', margin: 0 }}>
                      {question.sampleOutput}
                    </Typography>
                  </Paper>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#4F8BFF' }}>
                    Code Editor
                  </Typography>
                  <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <CodeEditor code={code} onChange={setCode} onRun={() => runCode(false)} />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => runCode(false)}
                      disabled={loading}
                      sx={{ flex: 1 }}
                    >
                      {loading ? 'Running...' : 'Run Code (Ctrl+Enter)'}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => runCode(true)}
                      disabled={loading}
                      sx={{ flex: 1 }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Paper>

                <TestcaseResult results={results} />
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

