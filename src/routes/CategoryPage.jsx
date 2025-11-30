import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'
import { questions, categories } from '../data/questions'
import Sidebar from '../components/Sidebar'
import QuestionCard from '../components/QuestionCard'
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { motion } from 'framer-motion'

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        const progressDoc = await getDoc(doc(db, 'users', user.uid, 'progress', id))
        if (progressDoc.exists()) {
          const data = progressDoc.data()
          setProgress(data)
          setUnlocked(data.unlocked)
        } else {
          setUnlocked(id === 'Basics')
          setProgress({ solved: [], completed: false })
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
        setUnlocked(id === 'Basics')
        setProgress({ solved: [], completed: false })
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [id, navigate])

  const categoryQuestions = questions[id] || []
  const category = categories.find(c => c.id === id)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#4F8BFF' }} />
      </Box>
    )
  }

  if (!unlocked) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg">
            <Alert severity="warning" sx={{ mt: 3 }}>
              This category is locked. Complete the previous category to unlock it.
            </Alert>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Back to Dashboard
            </Button>
          </Container>
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
          backgroundColor: '#0a0e27',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Typography variant="h4" component="h1" sx={{ color: '#4F8BFF', fontWeight: 'bold' }}>
                {category?.name || id}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {categoryQuestions.length} questions
            </Typography>
            <Grid container spacing={3}>
              {categoryQuestions.map((question) => (
                <Grid item xs={12} key={question.id}>
                  <QuestionCard
                    question={question}
                    categoryId={id}
                    solved={progress?.solved?.includes(question.id) || false}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

