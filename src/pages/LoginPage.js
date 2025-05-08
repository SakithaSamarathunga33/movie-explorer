import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container,
  Alert,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: { xs: 4, sm: 8 },
        }}
      >
        <Paper
          elevation={isDarkMode ? 8 : 3}
          sx={{
            p: { xs: 3, sm: 5 },
            width: '100%',
            borderRadius: 2,
            bgcolor: isDarkMode ? '#1E1E1E' : '#ffffff',
            boxShadow: isDarkMode 
              ? '0 10px 30px rgba(0, 0, 0, 0.7)' 
              : '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
          }}
        >
          <Typography 
            component="h1" 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 800, 
              color: isDarkMode ? '#E50914' : '#1976d2',
              letterSpacing: '-0.5px',
              mb: 1
            }}
          >
            MOVIE EXPLORER
          </Typography>
          <Typography 
            component="h2" 
            variant="h5" 
            align="center" 
            sx={{ 
              mb: 4,
              fontWeight: 500,
              color: isDarkMode ? '#FFFFFF' : 'inherit',
            }}
          >
            Sign In
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#E50914' : '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#FFFFFF' : 'rgba(0, 0, 0, 0.87)',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.54)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#E50914' : '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#FFFFFF' : 'rgba(0, 0, 0, 0.87)',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 4, 
                mb: 2, 
                py: 1.5,
                bgcolor: isDarkMode ? '#E50914' : '#1976d2',
                '&:hover': {
                  bgcolor: isDarkMode ? '#C00812' : '#1565c0',
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
                mt: 3,
                color: isDarkMode ? '#B3B3B3' : 'text.secondary',
              }}
            >
              For demo purposes, enter any non-empty username and password
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 