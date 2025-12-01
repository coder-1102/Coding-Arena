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
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material'

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
  const [marked, setMarked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [hintShown, setHintShown] = useState(false)
  const [hintDialogOpen, setHintDialogOpen] = useState(false)
  const [categoryQuestions, setCategoryQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login')
        return
      }

      setUser(currentUser)

      const categoryQuestionsList = questions[id]
      if (!categoryQuestionsList) {
        navigate('/dashboard')
        return
      }

      setCategoryQuestions(categoryQuestionsList)

      const q = categoryQuestionsList.find(q => q.id === parseInt(qid))
      if (!q) {
        navigate('/dashboard')
        return
      }

      setQuestion(q)
      
      // Find current question index
      const index = categoryQuestionsList.findIndex(q => q.id === parseInt(qid))
      setCurrentIndex(index)

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

      // Load marked questions
      try {
        const markedDoc = await getDoc(doc(db, 'users', currentUser.uid, 'marked', 'questions'))
        if (markedDoc.exists()) {
          const markedData = markedDoc.data()
          const questionKey = `${id}_${qid}`
          setMarked(markedData[questionKey] || false)
        }
      } catch (error) {
        console.error('Error loading marked questions:', error)
      }

      // Load attempts and hint status
      try {
        const attemptsDoc = await getDoc(doc(db, 'users', currentUser.uid, 'attempts', `${id}_${qid}`))
        if (attemptsDoc.exists()) {
          const data = attemptsDoc.data()
          setAttempts(data.count || 0)
          setHintShown(data.hintShown || false)
        }
      } catch (error) {
        console.error('Error loading attempts:', error)
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
            // Reset attempts on success
            if (user) {
              await setDoc(doc(db, 'users', user.uid, 'attempts', `${id}_${qid}`), {
                count: 0,
                hintShown: hintShown,
              }, { merge: true })
            }
            setAttempts(0)
          } else {
            // Increment failed attempts
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            if (user) {
              await setDoc(doc(db, 'users', user.uid, 'attempts', `${id}_${qid}`), {
                count: newAttempts,
                hintShown: hintShown,
              }, { merge: true })
            }
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
            // Reset attempts on success
            if (user) {
              await setDoc(doc(db, 'users', user.uid, 'attempts', `${id}_${qid}`), {
                count: 0,
                hintShown: hintShown,
              }, { merge: true })
            }
            setAttempts(0)
          } else {
            // Increment failed attempts
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            if (user) {
              await setDoc(doc(db, 'users', user.uid, 'attempts', `${id}_${qid}`), {
                count: newAttempts,
                hintShown: hintShown,
              }, { merge: true })
            }
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

  const toggleMarkForReview = async () => {
    if (!user) return

    try {
      const markedRef = doc(db, 'users', user.uid, 'marked', 'questions')
      const markedDoc = await getDoc(markedRef)
      
      let markedData = {}
      if (markedDoc.exists()) {
        markedData = markedDoc.data()
      }

      const questionKey = `${id}_${qid}`
      const newMarked = !marked
      markedData[questionKey] = newMarked

      // Also store category and question id for easy retrieval
      if (newMarked) {
        markedData[`${questionKey}_category`] = id
        markedData[`${questionKey}_qid`] = parseInt(qid)
      } else {
        delete markedData[`${questionKey}_category`]
        delete markedData[`${questionKey}_qid`]
      }

      await setDoc(markedRef, markedData, { merge: true })
      setMarked(newMarked)

      setSnackbar({
        open: true,
        message: newMarked ? 'Question marked for review!' : 'Question unmarked!',
        severity: 'success',
      })
    } catch (error) {
      console.error('Error toggling mark for review:', error)
    }
  }

  const showHint = () => {
    setHintDialogOpen(true)
    if (!hintShown && user) {
      setHintShown(true)
      setDoc(doc(db, 'users', user.uid, 'attempts', `${id}_${qid}`), {
        count: attempts,
        hintShown: true,
      }, { merge: true }).catch(err => console.error('Error saving hint status:', err))
    }
  }

  const navigateToQuestion = (direction) => {
    if (currentIndex === -1 || categoryQuestions.length === 0) return

    let newIndex
    if (direction === 'next') {
      newIndex = currentIndex + 1
      if (newIndex >= categoryQuestions.length) {
        // Already at last question
        return
      }
    } else {
      newIndex = currentIndex - 1
      if (newIndex < 0) {
        // Already at first question
        return
      }
    }

    const nextQuestion = categoryQuestions[newIndex]
    if (nextQuestion) {
      navigate(`/category/${id}/question/${nextQuestion.id}`)
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
              <IconButton
                onClick={toggleMarkForReview}
                sx={{
                  ml: 2,
                  color: marked ? '#FFD700' : 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${marked ? 'rgba(255, 215, 0, 0.3)' : 'rgba(79, 139, 255, 0.3)'}`,
                  '&:hover': {
                    background: marked ? 'rgba(255, 215, 0, 0.1)' : 'rgba(79, 139, 255, 0.1)',
                    border: `1px solid ${marked ? 'rgba(255, 215, 0, 0.5)' : 'rgba(79, 139, 255, 0.5)'}`,
                  },
                }}
                title={marked ? 'Unmark for review' : 'Mark for review'}
              >
                {marked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
              {attempts >= 3 && !hintShown && (
                <Button
                  startIcon={<LightbulbIcon />}
                  onClick={showHint}
                  sx={{
                    ml: 2,
                    background: 'linear-gradient(145deg, #FFA500 0%, #FF8C00 100%)',
                    border: '1px solid rgba(255, 165, 0, 0.3)',
                    color: '#000',
                    fontWeight: 700,
                    '&:hover': {
                      background: 'linear-gradient(145deg, #FFB347 0%, #FFA500 100%)',
                      boxShadow: '0 6px 24px rgba(255, 165, 0, 0.3)',
                    },
                  }}
                >
                  Get Hint
                </Button>
              )}
              {hintShown && (
                <Button
                  startIcon={<LightbulbIcon />}
                  onClick={() => setHintDialogOpen(true)}
                  sx={{
                    ml: 2,
                    background: 'linear-gradient(145deg, #FFA500 0%, #FF8C00 100%)',
                    border: '1px solid rgba(255, 165, 0, 0.3)',
                    color: '#000',
                    fontWeight: 700,
                    opacity: 0.7,
                    '&:hover': {
                      background: 'linear-gradient(145deg, #FFB347 0%, #FFA500 100%)',
                      boxShadow: '0 6px 24px rgba(255, 165, 0, 0.3)',
                      opacity: 1,
                    },
                  }}
                >
                  View Hint
                </Button>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
                <IconButton
                  onClick={() => navigateToQuestion('prev')}
                  disabled={currentIndex <= 0}
                  sx={{
                    color: currentIndex <= 0 ? 'rgba(255, 255, 255, 0.3)' : '#4F8BFF',
                    border: `1px solid ${currentIndex <= 0 ? 'rgba(79, 139, 255, 0.1)' : 'rgba(79, 139, 255, 0.3)'}`,
                    '&:hover': {
                      background: currentIndex <= 0 ? 'transparent' : 'rgba(79, 139, 255, 0.1)',
                      border: `1px solid ${currentIndex <= 0 ? 'rgba(79, 139, 255, 0.1)' : 'rgba(79, 139, 255, 0.5)'}`,
                    },
                    '&:disabled': {
                      opacity: 0.3,
                    },
                  }}
                  title="Previous Question"
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    minWidth: '80px',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                  }}
                >
                  {currentIndex >= 0 && categoryQuestions.length > 0 
                    ? `${currentIndex + 1} / ${categoryQuestions.length}`
                    : ''
                  }
                </Typography>
                <IconButton
                  onClick={() => navigateToQuestion('next')}
                  disabled={currentIndex >= categoryQuestions.length - 1}
                  sx={{
                    color: currentIndex >= categoryQuestions.length - 1 ? 'rgba(255, 255, 255, 0.3)' : '#4F8BFF',
                    border: `1px solid ${currentIndex >= categoryQuestions.length - 1 ? 'rgba(79, 139, 255, 0.1)' : 'rgba(79, 139, 255, 0.3)'}`,
                    '&:hover': {
                      background: currentIndex >= categoryQuestions.length - 1 ? 'transparent' : 'rgba(79, 139, 255, 0.1)',
                      border: `1px solid ${currentIndex >= categoryQuestions.length - 1 ? 'rgba(79, 139, 255, 0.1)' : 'rgba(79, 139, 255, 0.5)'}`,
                    },
                    '&:disabled': {
                      opacity: 0.3,
                    },
                  }}
                  title="Next Question"
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
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

      <Dialog
        open={hintDialogOpen}
        onClose={() => setHintDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)',
            border: '2px solid rgba(255, 165, 0, 0.3)',
            boxShadow: '0 12px 40px rgba(255, 165, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#FFA500', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon sx={{ color: '#FFA500' }} />
          Hint
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8, fontSize: '1.05rem' }}>
            {question.hint || 'Think about the problem step by step. Break it down into smaller subproblems and solve each one. Consider edge cases and special conditions.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHintDialogOpen(false)} sx={{ color: '#4F8BFF' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

