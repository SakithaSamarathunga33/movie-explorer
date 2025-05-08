import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Checkbox,
  FormControlLabel,
  Grid,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowForward, Star } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    
    const success = login(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: isDarkMode ? '#121212' : '#FFFFFF',
      }}
    >
      {/* Left Section - Hero Content */}
      <Box
        sx={{
          flex: { xs: '0 0 100%', md: '0 0 60%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 5%',
          position: 'relative',
          bgcolor: isDarkMode ? '#121212' : '#FFFFFF',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { md: '3.5rem', lg: '4rem' },
            lineHeight: 1.2,
            mb: 2,
            color: isDarkMode ? '#FFFFFF' : '#212121',
          }}
        >
          Discover Your Next
          <br />
          Favorite Movie
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: '1.1rem',
            mb: 5,
            maxWidth: '600px',
            color: isDarkMode ? '#B3B3B3' : '#757575',
          }}
        >
          Join our community of movie enthusiasts. Get personalized
          recommendations, create watchlists, and explore thousands of
          titles.
        </Typography>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          onClick={() => navigate('/')}
          sx={{
            bgcolor: isDarkMode ? '#E50914' : '#E50914',
            color: '#FFFFFF',
            py: 1.5,
            px: 4,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            width: 'fit-content',
            '&:hover': {
              bgcolor: isDarkMode ? '#C00812' : '#C00812',
            },
          }}
        >
          Explore Movies
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              sx={{ color: '#FFC107', fontSize: '1.5rem', mr: 0.5 }}
            />
          ))}          
        </Box>
      </Box>

      {/* Right Section - Login Form */}
      <Box
        sx={{
          flex: { xs: '0 0 100%', md: '0 0 40%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: '5%', md: '3%' },
          bgcolor: isDarkMode ? '#1E1E1E' : '#F7F9FC',
          borderRadius: { xs: 0, md: '20px 0 0 20px' },
          boxShadow: { xs: 'none', md: isDarkMode ? '-10px 0 30px rgba(0,0,0,0.5)' : '-10px 0 30px rgba(0,0,0,0.1)' },
          marginLeft: 'auto',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 450,
            mx: 'auto',
            px: { xs: 2, sm: 4 },
          }}
        >
          {/* Mobile only header */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: isDarkMode ? '#FFFFFF' : '#212121',
              }}
            >
              Discover Your Next Favorite Movie
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDarkMode ? '#B3B3B3' : '#757575',
              }}
            >
              Join our community of movie enthusiasts
            </Typography>
          </Box>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: isDarkMode ? '#FFFFFF' : '#212121',
            }}
          >
            Sign In
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: isDarkMode ? '#B3B3B3' : '#757575',
            }}
          >
            Access your account to continue
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                color: isDarkMode ? '#FFFFFF' : 'inherit',
                border: isDarkMode ? '1px solid rgba(229, 9, 20, 0.3)' : '1px solid rgba(211, 47, 47, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                color: isDarkMode ? '#FFFFFF' : '#212121',
              }}
            >
              Username
            </Typography>
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              placeholder="Enter your username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#E50914' : '#E50914',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '14px 16px',
                  color: isDarkMode ? '#FFFFFF' : '#212121',
                },
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: isDarkMode ? '#FFFFFF' : '#212121',
                }}
              >
                Password
              </Typography>              
            </Box>

            <TextField
              required
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#E50914' : '#E50914',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '14px 16px',
                  color: isDarkMode ? '#FFFFFF' : '#212121',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 4,
                py: 1.5,
                bgcolor: '#E50914',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: '#C00812',
                },
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 1,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
              }}
            >
              Sign In
            </Button>            
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 4,
                fontSize: '0.8rem',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }}
            >
              For demo purposes, enter any non-empty username and password
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage; 