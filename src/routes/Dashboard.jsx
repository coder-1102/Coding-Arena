import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, setDoc, writeBatch } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'
import { categories, questions } from '../data/questions'
import Sidebar from '../components/Sidebar'
import CategoryCard from '../components/CategoryCard'
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
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

  const handleResetAll = async () => {
    const user = auth.currentUser
    if (!user) return

    setResetting(true)
    try {
      const batch = writeBatch(db)

      // For each category, reset progress and save last solutions
      for (const category of categories) {
        const categoryId = category.id
        const categoryQuestions = questions[categoryId] || []
        
        // Get current progress
        const progressRef = doc(db, 'users', user.uid, 'progress', categoryId)
        const progressDoc = await getDoc(progressRef)
        const solvedList = progressDoc.exists() ? (progressDoc.data().solved || []) : []

        // For each solved question, save the current code as last solution
        for (const qid of solvedList) {
          const question = categoryQuestions.find(q => q.id === qid)
          if (question) {
            // Get current code
            const codeRef = doc(db, 'users', user.uid, 'codes', qid.toString())
            const codeDoc = await getDoc(codeRef)
            
            if (codeDoc.exists() && codeDoc.data().code) {
              // Save as last solution
              const lastSolutionRef = doc(db, 'users', user.uid, 'lastSolutions', `${categoryId}_${qid}`)
              batch.set(lastSolutionRef, {
                code: codeDoc.data().code,
                savedAt: new Date(),
              })
            }

            // Clear the code
            batch.set(codeRef, {
              code: '# Write your code here\n',
              updatedAt: new Date(),
            }, { merge: true })
          }
        }

        // Reset progress
        batch.set(progressRef, {
          unlocked: categoryId === 'Basics',
          solved: [],
          completed: false,
        }, { merge: true })
      }

      // Reset attempts
      try {
        const attemptsCollection = collection(db, 'users', user.uid, 'attempts')
        const attemptsSnapshot = await getDocs(attemptsCollection)
        attemptsSnapshot.forEach((doc) => {
          batch.delete(doc.ref)
        })
      } catch (error) {
        console.error('Error resetting attempts:', error)
      }

      await batch.commit()

      // Reload progress
      const progressData = {}
      for (const category of categories) {
        try {
          const progressDoc = await getDoc(doc(db, 'users', user.uid, 'progress', category.id))
          if (progressDoc.exists()) {
            progressData[category.id] = progressDoc.data()
          } else {
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
      setResetDialogOpen(false)
    } catch (error) {
      console.error('Error resetting all:', error)
      alert('Error resetting. Please try again.')
    } finally {
      setResetting(false)
    }
  }

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: '#4F8BFF', 
                  fontWeight: 700,
                  textShadow: '0 0 20px rgba(79, 139, 255, 0.4)',
                  letterSpacing: '0.5px',
                }}
              >
                Dashboard
              </Typography>
              <Button
                startIcon={<RestartAltIcon />}
                onClick={() => setResetDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(145deg, #8B0000 0%, #5a0000 100%)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  color: '#fff',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(145deg, #A00000 0%, #6a0000 100%)',
                    boxShadow: '0 6px 24px rgba(255, 0, 0, 0.3)',
                  },
                }}
              >
                Reset All
              </Button>
            </Box>
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

      <Dialog
        open={resetDialogOpen}
        onClose={() => !resetting && setResetDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)',
            border: '2px solid rgba(255, 0, 0, 0.3)',
            boxShadow: '0 12px 40px rgba(255, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#ff4444', fontWeight: 700 }}>
          Reset All Progress
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Are you sure you want to reset all your progress? This will:
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Clear all solved statuses</li>
              <li>Clear all your code solutions</li>
              <li>Save your current solutions as "Last Solution" (you can view them later)</li>
              <li>Reset all attempt counts</li>
            </ul>
            <strong style={{ color: '#ff4444' }}>This action cannot be undone!</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setResetDialogOpen(false)} 
            disabled={resetting}
            sx={{ color: '#4F8BFF' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleResetAll} 
            disabled={resetting}
            sx={{ 
              color: '#ff4444',
              '&:hover': {
                background: 'rgba(255, 0, 0, 0.1)',
              },
            }}
          >
            {resetting ? 'Resetting...' : 'Reset All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

