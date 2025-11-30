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
          backgroundColor: '#0a0e27',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h1" sx={{ mb: 4, color: '#4F8BFF', fontWeight: 'bold' }}>
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

