import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F8BFF',
    },
    background: {
      default: '#000000',
      paper: '#0a0a0a',
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          background: 'linear-gradient(145deg, #0a0a0a 0%, #000000 100%)',
          border: '1px solid rgba(79, 139, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(79, 139, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 48px rgba(79, 139, 255, 0.2), 0 0 0 1px rgba(79, 139, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)',
          border: '1px solid rgba(79, 139, 255, 0.3)',
          boxShadow: '0 4px 16px rgba(79, 139, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          '&:hover': {
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
            boxShadow: '0 6px 24px rgba(79, 139, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(79, 139, 255, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #0a0a0a 0%, #000000 100%)',
          border: '1px solid rgba(79, 139, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(79, 139, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

