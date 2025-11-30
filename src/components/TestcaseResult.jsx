import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

export default function TestcaseResult({ results }) {
  if (!results || results.length === 0) {
    return null
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#4F8BFF' }}>
        Testcase Results
      </Typography>
      {results.map((result, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            mb: 2,
            border: result.passed ? '2px solid #4F8BFF' : '2px solid #f44336',
            backgroundColor: result.passed ? 'rgba(79, 139, 255, 0.1)' : 'rgba(244, 67, 54, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {result.passed ? (
              <CheckCircleIcon sx={{ color: '#4F8BFF', mr: 1 }} />
            ) : (
              <CancelIcon sx={{ color: '#f44336', mr: 1 }} />
            )}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Testcase {index + 1} {result.passed ? 'Passed' : 'Failed'}
            </Typography>
          </Box>
          {!result.passed && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Expected: <code style={{ color: '#4F8BFF' }}>{result.expected}</code>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Got: <code style={{ color: '#f44336' }}>{result.got}</code>
              </Typography>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  )
}

