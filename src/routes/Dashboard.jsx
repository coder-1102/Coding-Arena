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
} from '@mui/material'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      const progressData = {}
      
      for (const category of categories) {
        try {
          const progressDoc = await getDoc(doc(db, 'users', user.uid, 'progress', category.id))
          if (progressDoc.exists()) {
            progressData[category.id] = progressDoc.data()
          } else {
            // Initialize if doesn't exist
            progressData[category.id] = {
              unlocked: category.id === 'Basics',
              solved: [],
              completed: false,
            }
          }
        } catch (error) {
          console.error(`Error fetching progress for ${category.id}:`, error)
          progressData[category.id] = {
            unlocked: category.id === 'Basics',
            solved: [],
            completed: false,
          }
        }
      }

      setProgress(progressData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  if (loading) {
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
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                mb: 4, 
                color: '#4F8BFF', 
                fontWeight: 700,
                textShadow: '0 0 20px rgba(79, 139, 255, 0.4)',
                letterSpacing: '0.5px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Dashboard
            </Typography>
            <Grid container spacing={3}>
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <CategoryCard
                    category={category}
                    progress={progress[category.id] || { solved: [], completed: false }}
                    unlocked={progress[category.id]?.unlocked ?? (category.id === 'Basics')}
                    completed={progress[category.id]?.completed || false}
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

