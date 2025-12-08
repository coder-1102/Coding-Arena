import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'
import { categories } from '../data/questions'
import Sidebar from '../components/Sidebar'
import CategoryCard from '../components/CategoryCard'
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material'
import QuizIcon from '@mui/icons-material/Quiz'
import { motion } from 'framer-motion'

export default function MockTests() {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [reward, setReward] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      const progressData = {}
      const mockCategories = categories.filter(c => c.id.startsWith('Mock_'))

      for (const category of mockCategories) {
        try {
          const progressDoc = await getDoc(doc(db, 'users', user.uid, 'progress', category.id))
          if (progressDoc.exists()) {
            progressData[category.id] = progressDoc.data()
          } else {
            progressData[category.id] = {
              unlocked: category.id === 'Mock_01',
              solved: [],
              completed: false,
            }
          }
        } catch (error) {
          console.error(`Error fetching progress for ${category.id}:`, error)
          progressData[category.id] = {
            unlocked: category.id === 'Mock_01',
            solved: [],
            completed: false,
          }
        }
      }

      setProgress(progressData)
      try {
        const rewardDoc = await getDoc(doc(db, 'users', user.uid, 'rewards', 'mock'))
        if (rewardDoc.exists()) {
          setReward(rewardDoc.data())
        }
      } catch (err) {
        console.error('Error loading rewards:', err)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const mockCategories = categories.filter(c => c.id.startsWith('Mock_'))

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#7B61FF' }} />
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
            background: 'radial-gradient(circle at 20% 50%, rgba(123, 97, 255, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(123, 97, 255, 0.04) 0%, transparent 50%)',
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
              <QuizIcon sx={{ color: '#7B61FF', fontSize: 40, mr: 2, filter: 'drop-shadow(0 0 12px rgba(123, 97, 255, 0.6))' }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: '#7B61FF', 
                  fontWeight: 700,
                  textShadow: '0 0 20px rgba(123, 97, 255, 0.4)',
                  letterSpacing: '0.5px',
                }}
              >
                Mock Tests (Proctored)
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/rewards')}
                sx={{
                  ml: 'auto',
                  color: '#7B61FF',
                  borderColor: 'rgba(123,97,255,0.4)',
                  '&:hover': { borderColor: '#7B61FF', background: 'rgba(123,97,255,0.1)' }
                }}
              >
                View Rewards
              </Button>
            </Box>

            <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
              Timed, fullscreen, no tab switching or pasting. Each mock has 2 coding + 2 SQL medium questions (littlemiss themed). Complete Mock Test 1 to unlock the next.
            </Typography>
            <Box sx={{ mb: 3, p: 2, border: '1px solid rgba(123,97,255,0.3)', borderRadius: 1, background: 'rgba(123,97,255,0.08)' }}>
              <Typography variant="subtitle1" sx={{ color: '#7B61FF', fontWeight: 700 }}>
                Rewards
              </Typography>
              {reward?.latest ? (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  You earned a {reward.latest} after completing {reward.lastCategory || 'a mock test'}!
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                  No rewards yet. Finish a mock to earn one!
                </Typography>
              )}
            </Box>

            <Grid container spacing={3}>
              {mockCategories.map((category, idx) => {
                const comingSoon = idx >= 2 // Mock_03 and beyond
                const unlocked = !comingSoon && (progress[category.id]?.unlocked ?? (category.id === 'Mock_01'))
                return (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <Box sx={{ position: 'relative' }}>
                      {comingSoon && (
                        <Chip
                          label="Coming soon"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(123,97,255,0.15)',
                            border: '1px solid rgba(123,97,255,0.4)',
                            color: '#7B61FF',
                            zIndex: 2,
                          }}
                        />
                      )}
                      <CategoryCard
                        category={category}
                        progress={progress[category.id] || { solved: [], completed: false }}
                        unlocked={unlocked}
                        completed={progress[category.id]?.completed || false}
                      />
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}


