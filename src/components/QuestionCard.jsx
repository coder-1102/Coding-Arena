import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { motion } from 'framer-motion'

export default function QuestionCard({ question, categoryId, solved }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/category/${categoryId}/question/${question.id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        sx={{
          cursor: 'pointer',
          background: solved
            ? 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)'
            : 'linear-gradient(145deg, #0a0a0a 0%, #000000 100%)',
          border: solved 
            ? '2px solid rgba(79, 139, 255, 0.3)'
            : '2px solid rgba(79, 139, 255, 0.1)',
          boxShadow: solved
            ? '0 12px 40px rgba(79, 139, 255, 0.15), 0 0 0 1px rgba(79, 139, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(79, 139, 255, 0.05)'
            : '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(79, 139, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: solved
              ? 'linear-gradient(90deg, transparent, rgba(79, 139, 255, 0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(79, 139, 255, 0.2), transparent)',
            opacity: solved ? 1 : 0,
            transition: 'opacity 0.3s',
          },
          '&:hover': {
            boxShadow: solved
              ? '0 16px 48px rgba(79, 139, 255, 0.25), 0 0 0 1px rgba(79, 139, 255, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.5)'
              : '0 12px 32px rgba(79, 139, 255, 0.2), 0 0 0 1px rgba(79, 139, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(79, 139, 255, 0.4)',
            '&::before': {
              opacity: 1,
            },
          },
        }}
        onClick={handleClick}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  mb: 1.5, 
                  color: solved ? '#4F8BFF' : 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 700,
                  textShadow: solved ? '0 0 15px rgba(79, 139, 255, 0.3)' : 'none',
                  letterSpacing: '0.3px',
                }}
              >
                {question.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2.5,
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.6,
                }}
              >
                {question.description.substring(0, 100)}...
              </Typography>
            </Box>
            {solved && (
              <CheckCircleIcon 
                sx={{ 
                  color: '#4F8BFF', 
                  ml: 2,
                  fontSize: 32,
                  filter: 'drop-shadow(0 0 8px rgba(79, 139, 255, 0.6))',
                }} 
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip 
              label={`ID: ${question.id}`} 
              size="small"
              sx={{
                background: 'rgba(79, 139, 255, 0.1)',
                border: '1px solid rgba(79, 139, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
              }}
            />
            <Chip 
              label={`${question.testcases.length} testcases`} 
              size="small"
              sx={{
                background: 'rgba(79, 139, 255, 0.1)',
                border: '1px solid rgba(79, 139, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

