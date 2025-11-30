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
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CodeIcon from '@mui/icons-material/Code'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 240

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#4F8BFF', fontWeight: 'bold' }}>
          Python IDE
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/dashboard'}
            onClick={() => navigate('/dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ color: '#4F8BFF' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderColor: '#4F8BFF', color: '#4F8BFF' }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  )
}

