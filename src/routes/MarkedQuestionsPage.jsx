import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { motion } from 'framer-motion'

export default function MarkedQuestionsPage() {
  const navigate = useNavigate()
  const [markedQuestions, setMarkedQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({})

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
        const marked = []
        for (const key in markedData) {
          if (key.endsWith('_category')) {
            const categoryId = markedData[key]
            const qidKey = key.replace('_category', '_qid')
            const qid = markedData[qidKey]
            
            if (categoryId && qid && questions[categoryId]) {
              const question = questions[categoryId].find(q => q.id === qid)
              if (question) {
                marked.push({ question, categoryId, qid })
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
                <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                  {markedQuestions.length} question{markedQuestions.length !== 1 ? 's' : ''} marked for review
                </Typography>
                <Grid container spacing={3}>
                  {markedQuestions.map(({ question, categoryId, qid }) => (
                    <Grid item xs={12} key={`${categoryId}_${qid}`}>
                      <QuestionCard
                        question={question}
                        categoryId={categoryId}
                        solved={progress[categoryId]?.solved?.includes(question.id) || false}
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

