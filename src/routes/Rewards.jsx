import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'
import { categories } from '../data/questions'
import Sidebar from '../components/Sidebar'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material'
import RedeemIcon from '@mui/icons-material/Redeem'
import { motion } from 'framer-motion'

const mockRewards = {
  Mock_01: 'ice cream',
  Mock_02: 'tiramisu',
  Mock_03: 'brownie',
  Mock_04: 'donut',
  Mock_05: 'cupcake',
  Mock_06: 'macaron',
  Mock_07: 'gelato',
  Mock_08: 'waffle',
  Mock_09: 'cheesecake',
  Mock_10: 'pudding',
  Mock_11: 'truffle',
  Mock_12: 'eclair',
  Mock_13: 'baklava',
  Mock_14: 'churro',
  Mock_15: 'cannoli',
  Mock_16: 'mousse',
  Mock_17: 'pie',
  Mock_18: 'flan',
  Mock_19: 'sundae',
  Mock_20: 'torte',
}

export default function Rewards() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({})
  const [rewards, setRewards] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        // Load mock progress
        const mockProgress = {}
        for (const category of categories.filter(c => c.id.startsWith('Mock_'))) {
          try {
            const p = await getDoc(doc(db, 'users', user.uid, 'progress', category.id))
            if (p.exists()) mockProgress[category.id] = p.data()
          } catch (e) {
            console.error('Error loading progress for', category.id, e)
          }
        }
        setProgress(mockProgress)

        // Load rewards doc
        try {
          const rewardsDoc = await getDoc(doc(db, 'users', user.uid, 'rewards', 'mock'))
          if (rewardsDoc.exists()) {
            setRewards(rewardsDoc.data().items || {})
          }
        } catch (err) {
          console.error('Error loading rewards doc:', err)
        }
      } finally {
        setLoading(false)
      }
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
              <RedeemIcon sx={{ color: '#7B61FF', fontSize: 40, mr: 2, filter: 'drop-shadow(0 0 12px rgba(123, 97, 255, 0.6))' }} />
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
                Rewards
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {mockCategories.map((category) => {
                const completed = progress[category.id]?.completed
                const rewardItem = rewards[category.id] || mockRewards[category.id]
                const revealed = completed && Boolean(rewardItem)
                return (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)',
                        border: '1px solid rgba(123,97,255,0.25)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                        {revealed
                          ? `Reward: ${rewardItem}`
                          : completed
                            ? 'Reward earned! (revealed soon)'
                            : 'Complete this mock to reveal the reward'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Status: {completed ? 'Completed' : 'Locked'}
                      </Typography>
                    </Paper>
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


