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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        sx={{
          cursor: unlocked ? 'pointer' : 'not-allowed',
          opacity: unlocked ? 1 : 0.5,
          position: 'relative',
          height: '100%',
          background: unlocked 
            ? 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)'
            : 'linear-gradient(145deg, #050505 0%, #000000 100%)',
          border: unlocked 
            ? '2px solid rgba(79, 139, 255, 0.2)'
            : '2px solid rgba(255, 255, 255, 0.05)',
          boxShadow: unlocked
            ? '0 12px 40px rgba(79, 139, 255, 0.15), 0 0 0 1px rgba(79, 139, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(79, 139, 255, 0.05)'
            : '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.5)',
          transform: 'perspective(1000px) rotateX(0deg)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': unlocked ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(79, 139, 255, 0.5), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s',
          } : {},
          '&:hover::before': unlocked ? {
            opacity: 1,
          } : {},
        }}
        onClick={handleClick}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                color: unlocked ? '#4F8BFF' : 'rgba(255, 255, 255, 0.3)',
                fontWeight: 700,
                textShadow: unlocked ? '0 0 20px rgba(79, 139, 255, 0.3)' : 'none',
                letterSpacing: '0.5px',
              }}
            >
              {category.name}
            </Typography>
            {!unlocked && <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: 28 }} />}
            {completed && (
              <CheckCircleIcon 
                sx={{ 
                  color: '#4F8BFF',
                  fontSize: 28,
                  filter: 'drop-shadow(0 0 8px rgba(79, 139, 255, 0.6))',
                }} 
              />
            )}
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2.5,
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500,
              letterSpacing: '0.3px',
            }}
          >
            {category.total} questions
          </Typography>
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 10,
                borderRadius: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(79, 139, 255, 0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #4F8BFF 0%, #6BA3FF 100%)',
                  boxShadow: '0 0 12px rgba(79, 139, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                },
              }}
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 600,
              letterSpacing: '0.3px',
            }}
          >
            {progress.solved.length} / {category.total} solved
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  )
}

