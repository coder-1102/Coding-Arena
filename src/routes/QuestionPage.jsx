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
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(79, 139, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(79, 139, 255, 0.02) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/category/${id}`)}
                sx={{ 
                  mr: 2,
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)',
                  border: '1px solid rgba(79, 139, 255, 0.3)',
                  boxShadow: '0 4px 16px rgba(79, 139, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
                    boxShadow: '0 6px 24px rgba(79, 139, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Back
              </Button>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: '#4F8BFF', 
                  fontWeight: 700, 
                  flex: 1,
                  textShadow: '0 0 20px rgba(79, 139, 255, 0.4)',
                  letterSpacing: '0.5px',
                }}
              >
                {question.title}
                {solved && (
                  <CheckCircleIcon 
                    sx={{ 
                      ml: 2, 
                      color: '#4F8BFF', 
                      verticalAlign: 'middle',
                      filter: 'drop-shadow(0 0 8px rgba(79, 139, 255, 0.6))',
                    }} 
                  />
                )}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 5, 
                    mb: 3,
                    background: 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)',
                    border: '2px solid rgba(79, 139, 255, 0.2)',
                    boxShadow: '0 12px 40px rgba(79, 139, 255, 0.15), 0 0 0 1px rgba(79, 139, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(79, 139, 255, 0.05)',
                    position: 'relative',
                    zIndex: 1,
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0, 0, 0, 0.3)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(79, 139, 255, 0.3)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: 'rgba(79, 139, 255, 0.5)',
                      },
                    },
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      color: '#4F8BFF',
                      fontWeight: 700,
                      textShadow: '0 0 20px rgba(79, 139, 255, 0.4)',
                      letterSpacing: '0.5px',
                      fontSize: '1.5rem',
                    }}
                  >
                    Description
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 4, 
                      whiteSpace: 'pre-wrap',
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.9,
                      fontSize: '1.05rem',
                    }}
                  >
                    {question.description}
                  </Typography>

                  <Divider sx={{ my: 4, borderColor: 'rgba(79, 139, 255, 0.2)' }} />

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2.5, 
                      color: '#4F8BFF',
                      fontWeight: 700,
                      textShadow: '0 0 15px rgba(79, 139, 255, 0.3)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Constraints
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 4,
                      color: 'rgba(255, 255, 255, 0.75)',
                      fontWeight: 500,
                      fontSize: '1rem',
                    }}
                  >
                    {question.constraints}
                  </Typography>

                  <Divider sx={{ my: 4, borderColor: 'rgba(79, 139, 255, 0.2)' }} />

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2.5, 
                      color: '#4F8BFF',
                      fontWeight: 700,
                      textShadow: '0 0 15px rgba(79, 139, 255, 0.3)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Sample Input
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      mb: 3,
                      background: 'linear-gradient(145deg, #000000 0%, #0a0a0a 100%)',
                      border: '1px solid rgba(79, 139, 255, 0.2)',
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(79, 139, 255, 0.15)',
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      component="pre" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        margin: 0,
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {question.sampleInput || 'N/A'}
                    </Typography>
                  </Paper>

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2.5, 
                      color: '#4F8BFF',
                      fontWeight: 700,
                      textShadow: '0 0 15px rgba(79, 139, 255, 0.3)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Sample Output
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 3,
                      background: 'linear-gradient(145deg, #000000 0%, #0a0a0a 100%)',
                      border: '1px solid rgba(79, 139, 255, 0.2)',
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(79, 139, 255, 0.15)',
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      component="pre" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        margin: 0,
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {question.sampleOutput}
                    </Typography>
                  </Paper>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 0,
                    mb: 3,
                    background: 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)',
                    border: '2px solid rgba(79, 139, 255, 0.2)',
                    boxShadow: '0 12px 40px rgba(79, 139, 255, 0.15), 0 0 0 1px rgba(79, 139, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(79, 139, 255, 0.05)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100vh - 200px)',
                    minHeight: '700px',
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderBottom: '1px solid rgba(79, 139, 255, 0.2)',
                      background: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#4F8BFF',
                        fontWeight: 700,
                        textShadow: '0 0 15px rgba(79, 139, 255, 0.3)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Code Editor
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      flex: 1,
                      border: 'none',
                      overflow: 'hidden',
                      background: '#000000',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, rgba(79, 139, 255, 0.5), transparent)',
                        zIndex: 1,
                      },
                    }}
                  >
                    <CodeEditor code={code} onChange={setCode} onRun={() => runCode(false)} />
                  </Box>
                  <Box 
                    sx={{ 
                      p: 3,
                      borderTop: '1px solid rgba(79, 139, 255, 0.2)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => runCode(false)}
                      disabled={loading}
                      sx={{ 
                        flex: 1,
                        py: 1.5,
                        background: 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)',
                        border: '1px solid rgba(79, 139, 255, 0.3)',
                        boxShadow: '0 4px 16px rgba(79, 139, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
                          boxShadow: '0 6px 24px rgba(79, 139, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        },
                        '&:disabled': {
                          opacity: 0.5,
                        },
                      }}
                    >
                      {loading ? 'Running...' : 'Run Code (Ctrl+Enter)'}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => runCode(true)}
                      disabled={loading}
                      sx={{ 
                        flex: 1,
                        py: 1.5,
                        background: 'linear-gradient(145deg, #1a4a1a 0%, #0a2a0a 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        boxShadow: '0 4px 16px rgba(76, 175, 80, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          background: 'linear-gradient(145deg, #2a5a2a 0%, #1a4a1a 100%)',
                          boxShadow: '0 6px 24px rgba(76, 175, 80, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        },
                        '&:disabled': {
                          opacity: 0.5,
                        },
                      }}
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

