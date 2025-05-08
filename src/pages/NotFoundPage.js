import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        textAlign: 'center',
        padding: 3,
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          fontSize: 100, 
          color: isDarkMode ? '#E50914' : theme.palette.primary.main,
          mb: 2
        }} 
      />
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          color: isDarkMode ? '#FFFFFF' : 'inherit',
          textShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        404
      </Typography>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontWeight: 500,
          color: isDarkMode ? '#FFFFFF' : 'inherit',
          mb: 3
        }}
      >
        Page Not Found
      </Typography>
      <Typography 
        variant="body1" 
        paragraph
        sx={{
          maxWidth: 500,
          mb: 4,
          color: isDarkMode ? '#B3B3B3' : 'text.secondary'
        }}
      >
        We can't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        sx={{
          bgcolor: isDarkMode ? '#E50914' : theme.palette.primary.main,
          '&:hover': {
            bgcolor: isDarkMode ? '#C00812' : theme.palette.primary.dark,
          },
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 1,
          textTransform: 'none',
          fontSize: '1rem'
        }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage; 