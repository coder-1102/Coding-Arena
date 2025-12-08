import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'
import { questions } from '../data/questions'
import Sidebar from '../components/Sidebar'
import QuestionCard from '../components/QuestionCard'
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
} from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { motion } from 'framer-motion'
import { categories } from '../data/questions'

export default function MarkedQuestionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [markedQuestions, setMarkedQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.selectedCategory || 'all'
  )
  const [scrollTarget, setScrollTarget] = useState(location.state?.scrollTo || null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        // Load marked questions
        const markedDoc = await getDoc(doc(db, 'users', user.uid, 'marked', 'questions'))
        const markedData = markedDoc.exists() ? markedDoc.data() : {}
        
        // Extract marked questions
        // Format: key is "categoryId_questionId", value is true/false
        // Also has metadata: "categoryId_questionId_category" and "categoryId_questionId_qid"
        const marked = []
        const processedKeys = new Set()
        
        for (const key in markedData) {
          // Check if this is a main marked question key (ends with _category means it's metadata)
          if (!key.endsWith('_category') && !key.endsWith('_qid') && markedData[key] === true) {
            // Parse "categoryId_questionId" format
            const parts = key.split('_')
            if (parts.length >= 2) {
              const qid = parseInt(parts.pop(), 10)
              const categoryId = parts.join('_')

              if (
                categoryId &&
                Number.isInteger(qid) &&
                questions[categoryId] &&
                !processedKeys.has(key)
              ) {
                const question = questions[categoryId].find(q => q.id === qid)
                if (question) {
                  marked.push({ question, categoryId, qid })
                  processedKeys.add(key)
                }
              }
            }
          }
        }

        setMarkedQuestions(marked)

        // Load progress for all categories
        const progressData = {}
        for (const categoryId of Object.keys(questions)) {
          try {
            const progressDoc = await getDoc(doc(db, 'users', user.uid, 'progress', categoryId))
            if (progressDoc.exists()) {
              progressData[categoryId] = progressDoc.data()
            }
          } catch (err) {
            console.error(`Error loading progress for ${categoryId}:`, err)
          }
        }
        setProgress(progressData)
      } catch (error) {
        console.error('Error loading marked questions:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory)
    }
    if (location.state?.scrollTo) {
      setScrollTarget(location.state.scrollTo)
    }
  }, [location.state])

  useEffect(() => {
    if (loading || !scrollTarget) return

    const el = document.getElementById(`marked-question-${scrollTarget}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setScrollTarget(null)
    }
  }, [loading, scrollTarget, markedQuestions])

  const handleNavigateToQuestion = (categoryId, qid) => {
    navigate(`/category/${categoryId}/question/${qid}`, {
      state: {
        fromMarked: true,
        markedCategory: selectedCategory,
        scrollKey: `${categoryId}_${qid}`,
      },
    })
  }

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') return markedQuestions
    return markedQuestions.filter((mq) => mq.categoryId === selectedCategory)
  }, [markedQuestions, selectedCategory])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress sx={{ color: '#4F8BFF' }} />
        </Box>
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
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
              <BookmarkIcon sx={{ color: '#FFD700', fontSize: 40, mr: 2, filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))' }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: '#FFD700', 
                  fontWeight: 700,
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                  letterSpacing: '0.5px',
                }}
              >
                Marked for Review
              </Typography>
            </Box>

            {markedQuestions.length === 0 ? (
              <Paper
                sx={{
                  p: 5,
                  background: 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)',
                  border: '2px solid rgba(79, 139, 255, 0.2)',
                  textAlign: 'center',
                }}
              >
                <BookmarkIcon sx={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 80, mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  No questions marked for review
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Mark questions while solving them to review them later
                </Typography>
              </Paper>
            ) : (
              <>
                <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
                  <Tabs
                    value={selectedCategory}
                    onChange={(e, newValue) => setSelectedCategory(newValue)}
                    sx={{
                      borderBottom: '1px solid rgba(79, 139, 255, 0.2)',
                      '& .MuiTab-root': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&.Mui-selected': {
                          color: '#FFD700',
                          fontWeight: 700,
                        },
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#FFD700',
                      },
                    }}
                  >
                    <Tab label={`All (${markedQuestions.length})`} value="all" />
                    {categories.map((category) => {
                      const categoryCount = markedQuestions.filter(
                        (mq) => mq.categoryId === category.id
                      ).length
                      if (categoryCount > 0) {
                        return (
                          <Tab
                            key={category.id}
                            label={`${category.name} (${categoryCount})`}
                            value={category.id}
                          />
                        )
                      }
                      return null
                    })}
                  </Tabs>
                </Box>

                <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                  {selectedCategory === 'all'
                    ? `${markedQuestions.length} question${markedQuestions.length !== 1 ? 's' : ''} marked for review`
                    : `${filteredQuestions.length} question${filteredQuestions.length !== 1 ? 's' : ''} in ${categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}`}
                </Typography>

                <Grid container spacing={3}>
                  {filteredQuestions.map(({ question, categoryId, qid }) => (
                    <Grid item xs={12} key={`${categoryId}_${qid}`} id={`marked-question-${categoryId}_${qid}`}>
                      <QuestionCard
                        question={question}
                        categoryId={categoryId}
                        solved={progress[categoryId]?.solved?.includes(question.id) || false}
                        marked={true}
                        onNavigate={() => handleNavigateToQuestion(categoryId, qid)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

