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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          cursor: 'pointer',
          border: solved ? '2px solid #4F8BFF' : '2px solid transparent',
        }}
        onClick={handleClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 1, color: '#4F8BFF' }}>
                {question.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description.substring(0, 100)}...
              </Typography>
            </Box>
            {solved && (
              <CheckCircleIcon sx={{ color: '#4F8BFF', ml: 2 }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`ID: ${question.id}`} size="small" />
            <Chip label={`${question.testcases.length} testcases`} size="small" />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

