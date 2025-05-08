import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, useMediaQuery, Menu, MenuItem } from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon, Favorite, Home } from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { mode, toggleColorMode } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isDarkMode = mode === 'dark';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleFavorites = () => {
    handleClose();
    navigate('/favorites');
  };

  const handleHome = () => {
    handleClose();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: isDarkMode ? '#121212' : '#FFFFFF',
          borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar sx={{ width: '100%', maxWidth: 1920, mx: 'auto', px: { xs: 1, sm: 2, md: 3 } }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 800,
              color: isDarkMode ? '#90CAF9' : '#3F51B5',
              textDecoration: 'none',
              flexGrow: 1,
              letterSpacing: '-0.5px',
            }}
          >
            MOVIE EXPLORER
          </Typography>

          <IconButton 
            onClick={toggleColorMode} 
            sx={{ 
              ml: 1,
              color: isDarkMode ? '#FFFFFF' : '#3F51B5' 
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {isAuthenticated ? (
            <>
              {!isMobile && (
                <>
                  <Button 
                    component={Link} 
                    to="/"
                    startIcon={<Home sx={{ color: isDarkMode ? '#FFFFFF' : '#3F51B5' }} />}
                    sx={{ 
                      mx: 1,
                      color: isDarkMode ? '#FFFFFF' : '#3F51B5',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(63, 81, 181, 0.04)',
                      }
                    }}
                  >
                    Home
                  </Button>
                  <Button 
                    component={Link} 
                    to="/favorites"
                    startIcon={<Favorite sx={{ color: isDarkMode ? '#F48FB1' : '#FF4081' }} />}
                    sx={{ 
                      mx: 1,
                      color: isDarkMode ? '#FFFFFF' : '#3F51B5',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(63, 81, 181, 0.04)',
                      }
                    }}
                  >
                    Favorites
                  </Button>
                </>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!isMobile && (
                  <Typography variant="body2" sx={{ 
                    mr: 2, 
                    fontWeight: 500,
                    color: isDarkMode ? '#B3B3B3' : '#757575'
                  }}>
                    Hi, {user?.username}!
                  </Typography>
                )}
                
                {isMobile ? (
                  <>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="menu"
                      onClick={handleMenu}
                      sx={{ 
                        color: isDarkMode ? '#FFFFFF' : '#3F51B5'
                      }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        sx: {
                          bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        }
                      }}
                    >
                      <MenuItem onClick={handleHome}>Home</MenuItem>
                      <MenuItem onClick={handleFavorites}>Favorites</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button 
                    color="primary" 
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{ 
                      borderRadius: '4px',
                      borderColor: isDarkMode ? '#90CAF9' : '#3F51B5',
                      color: isDarkMode ? '#90CAF9' : '#3F51B5',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(63, 81, 181, 0.1)',
                        borderColor: isDarkMode ? '#90CAF9' : '#3F51B5',
                      }
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Box>
            </>
          ) : (
            location.pathname !== '/login' && (
              <Button 
                color="primary" 
                variant="contained"
                component={Link} 
                to="/login"
                sx={{
                  borderRadius: '4px',
                  py: 0.5,
                  px: 2,
                  fontWeight: 600,
                  boxShadow: 3,
                  bgcolor: isDarkMode ? '#90CAF9' : '#3F51B5',
                  color: isDarkMode ? '#121212' : '#FFFFFF',
                  '&:hover': {
                    bgcolor: isDarkMode ? '#42a5f5' : '#303f9f',
                  }
                }}
              >
                Login
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: isDarkMode ? '#121212' : '#F9F9F9',
          borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          width: '100%'
        }}
      >
        <Box maxWidth="xl" sx={{ width: '100%', maxWidth: 1920, mx: 'auto', px: { xs: 1, sm: 2, md: 3 } }}>
          <Typography 
            variant="body2" 
            color={isDarkMode ? '#B3B3B3' : '#757575'} 
            align="center"
          >
            Movie Explorer App - {new Date().getFullYear()} © All Rights Reserved
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;