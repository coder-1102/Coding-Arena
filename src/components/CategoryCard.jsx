import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  IconButton,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { motion } from 'framer-motion'

export default function CategoryCard({ category, progress, unlocked, completed }) {
  const navigate = useNavigate()
  const percentage = (progress.solved.length / category.total) * 100

  const handleClick = () => {
    if (unlocked) {
      navigate(`/category/${category.id}`)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          cursor: unlocked ? 'pointer' : 'not-allowed',
          opacity: unlocked ? 1 : 0.6,
          position: 'relative',
          height: '100%',
        }}
        onClick={handleClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ color: '#4F8BFF' }}>
              {category.name}
            </Typography>
            {!unlocked && <LockIcon sx={{ color: 'text.secondary' }} />}
            {completed && <CheckCircleIcon sx={{ color: '#4F8BFF' }} />}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {category.total} questions
          </Typography>
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4F8BFF',
                },
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {progress.solved.length} / {category.total} solved
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  )
}

