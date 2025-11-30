import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CodeIcon from '@mui/icons-material/Code'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const drawerWidth = 260
const collapsedWidth = 70

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
            boxSizing: 'border-box',
            borderRight: '2px solid rgba(79, 139, 255, 0.2)',
            background: 'linear-gradient(145deg, #0f0f0f 0%, #000000 100%)',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5), inset -2px 0 4px rgba(79, 139, 255, 0.05)',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
          },
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: open ? 'space-between' : 'center',
            minHeight: 64,
          }}
        >
          {open && (
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#4F8BFF', 
                fontWeight: 700,
                textShadow: '0 0 15px rgba(79, 139, 255, 0.3)',
                letterSpacing: '0.5px',
              }}
            >
              Python IDE
            </Typography>
          )}
          <IconButton
            onClick={toggleDrawer}
            sx={{
              color: '#4F8BFF',
              border: '1px solid rgba(79, 139, 255, 0.2)',
              '&:hover': {
                background: 'rgba(79, 139, 255, 0.1)',
                border: '1px solid rgba(79, 139, 255, 0.3)',
              },
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(79, 139, 255, 0.2)' }} />
        <List sx={{ flex: 1 }}>
          <ListItem disablePadding>
            <Tooltip title={open ? '' : 'Dashboard'} placement="right">
              <ListItemButton
                selected={location.pathname === '/dashboard'}
                onClick={() => navigate('/dashboard')}
                sx={{
                  minHeight: 56,
                  justifyContent: open ? 'flex-start' : 'center',
                  px: open ? 3 : 2,
                  '&.Mui-selected': {
                    background: 'rgba(79, 139, 255, 0.15)',
                    borderLeft: '3px solid #4F8BFF',
                    '&:hover': {
                      background: 'rgba(79, 139, 255, 0.2)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(79, 139, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 56 : 0,
                    justifyContent: 'center',
                    color: location.pathname === '/dashboard' ? '#4F8BFF' : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary="Dashboard" 
                    primaryTypographyProps={{
                      fontWeight: location.pathname === '/dashboard' ? 700 : 500,
                      color: location.pathname === '/dashboard' ? '#4F8BFF' : 'rgba(255, 255, 255, 0.8)',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
        <Divider sx={{ borderColor: 'rgba(79, 139, 255, 0.2)' }} />
        <Box sx={{ p: 2 }}>
          <Tooltip title={open ? '' : 'Logout'} placement="right">
            <Button
              fullWidth={open}
              variant="outlined"
              startIcon={open ? <LogoutIcon /> : null}
              onClick={handleLogout}
              sx={{ 
                borderColor: 'rgba(79, 139, 255, 0.3)',
                color: '#4F8BFF',
                minWidth: open ? 'auto' : 48,
                px: open ? 2 : 1,
                '&:hover': {
                  borderColor: 'rgba(79, 139, 255, 0.5)',
                  background: 'rgba(79, 139, 255, 0.1)',
                },
              }}
            >
              {open ? 'Logout' : <LogoutIcon />}
            </Button>
          </Tooltip>
        </Box>
      </Drawer>
    </>
  )
}

