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
    <Box sx={{ mt: 3, position: 'relative', zIndex: 1 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: '#4F8BFF',
          fontWeight: 700,
          textShadow: '0 0 15px rgba(79, 139, 255, 0.3)',
          letterSpacing: '0.5px',
        }}
      >
        Testcase Results
      </Typography>
      {results.map((result, index) => (
        <Paper
          key={index}
          sx={{
            p: 3,
            mb: 2.5,
            background: result.passed 
              ? 'linear-gradient(145deg, #0f1a0f 0%, #000000 100%)'
              : 'linear-gradient(145deg, #1a0f0f 0%, #000000 100%)',
            border: result.passed 
              ? '2px solid rgba(79, 139, 255, 0.3)'
              : '2px solid rgba(244, 67, 54, 0.3)',
            boxShadow: result.passed
              ? '0 8px 32px rgba(79, 139, 255, 0.15), 0 0 0 1px rgba(79, 139, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.5)'
              : '0 8px 32px rgba(244, 67, 54, 0.15), 0 0 0 1px rgba(244, 67, 54, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: result.passed
                ? 'linear-gradient(90deg, transparent, rgba(79, 139, 255, 0.5), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(244, 67, 54, 0.5), transparent)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            {result.passed ? (
              <CheckCircleIcon 
                sx={{ 
                  color: '#4F8BFF', 
                  mr: 1.5,
                  fontSize: 28,
                  filter: 'drop-shadow(0 0 8px rgba(79, 139, 255, 0.6))',
                }} 
              />
            ) : (
              <CancelIcon 
                sx={{ 
                  color: '#f44336', 
                  mr: 1.5,
                  fontSize: 28,
                  filter: 'drop-shadow(0 0 8px rgba(244, 67, 54, 0.6))',
                }} 
              />
            )}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700,
                color: result.passed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.3px',
              }}
            >
              Testcase {index + 1} {result.passed ? 'Passed' : 'Failed'}
            </Typography>
          </Box>
          {!result.passed && (
            <Box sx={{ mt: 2, pl: 5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                }}
              >
                Expected: <code style={{ 
                  color: '#4F8BFF', 
                  background: 'rgba(79, 139, 255, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  fontFamily: 'monospace',
                }}>{result.expected}</code>
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                }}
              >
                Got: <code style={{ 
                  color: '#f44336', 
                  background: 'rgba(244, 67, 54, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  fontFamily: 'monospace',
                }}>{result.got}</code>
              </Typography>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  )
}

