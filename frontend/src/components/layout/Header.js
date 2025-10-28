import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Hotel as HotelIcon, 
  Dashboard,
  BookOnline,
  ExitToApp,
  Person
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none', 
            color: 'inherit',
            flexGrow: 1
          }}
        >
          <HotelIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FFF 30%, #E2E8F0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            LuxeStay
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Only show Explore Hotels for non-admin users */}
          {isAuthenticated && user?.role !== 'HOTEL_ADMIN' && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/hotels')}
              sx={{ 
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Explore Hotels
            </Button>
          )}

          {/* Show Admin Dashboard button for admins */}
          {isAuthenticated && user?.role === 'HOTEL_ADMIN' && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/admin')}
              sx={{ 
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Admin Dashboard
            </Button>
          )}
          
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ 
                  ml: 1,
                  border: '2px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    fontSize: '0.9rem'
                  }}
                >
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Welcome back,
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.role === 'HOTEL_ADMIN' ? 'Hotel Administrator' : 'Customer'}
                  </Typography>
                </Box>
                <Divider />
                
                <MenuItem onClick={() => handleNavigation('/profile')}>
                  <Person sx={{ mr: 2, color: 'primary.main' }} />
                  My Profile
                </MenuItem>
                
                {/* Only show My Bookings for customers */}
                {user?.role !== 'HOTEL_ADMIN' && (
                  <MenuItem onClick={() => handleNavigation('/my-bookings')}>
                    <BookOnline sx={{ mr: 2, color: 'primary.main' }} />
                    My Bookings
                  </MenuItem>
                )}
                
                {/* Show Admin Dashboard for admins */}
                {user?.role === 'HOTEL_ADMIN' && (
                  <MenuItem onClick={() => handleNavigation('/admin')}>
                    <Dashboard sx={{ mr: 2, color: 'primary.main' }} />
                    Admin Dashboard
                  </MenuItem>
                )}
                
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 2, color: 'error.main' }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;