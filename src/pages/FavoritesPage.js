import React from 'react';
import { Box, Typography, Alert, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import { useFavorites } from '../hooks/useFavorites';
import CustomContainer from '../components/Container';

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <CustomContainer>
      <Box sx={{ width: '100%' }}>
        <Box 
          sx={{ 
            mb: 5, 
            pb: 4,
            borderBottom: isDarkMode 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid rgba(0,0,0,0.1)',
            textAlign: { xs: 'center', md: 'left' },
            width: '100%'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              mb: 2, 
              fontWeight: 800, 
              color: isDarkMode ? '#FFFFFF' : '#212121',
              letterSpacing: '-0.5px',
            }}
          >
            YOUR FAVORITES
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: isDarkMode ? '#B3B3B3' : '#757575',
              fontWeight: 400,
            }}
          >
            Movies you've saved to your favorites collection
          </Typography>
        </Box>

        {favorites.length > 0 ? (
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 700, 
                color: isDarkMode ? '#FFFFFF' : '#212121',
                borderLeft: isDarkMode ? '4px solid #90CAF9' : '4px solid #3F51B5', 
                pl: 2
              }}
            >
              Your Collection ({favorites.length} {favorites.length === 1 ? 'movie' : 'movies'})
            </Typography>
            <MovieGrid movies={favorites} />
          </Box>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 2,
              width: '100%',
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: 2,
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4, 
                maxWidth: 500, 
                mx: 'auto',
                bgcolor: isDarkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(63, 81, 181, 0.05)',
                border: isDarkMode ? '1px solid rgba(144, 202, 249, 0.2)' : '1px solid rgba(63, 81, 181, 0.1)',
                color: isDarkMode ? '#FFFFFF' : '#212121'
              }}
            >
              You haven't added any movies to your favorites yet.
            </Alert>
            <Button 
              variant="contained" 
              component={Link} 
              to="/"
              size="large"
              sx={{
                px: 3,
                py: 1,
                bgcolor: isDarkMode ? '#90CAF9' : '#3F51B5',
                color: isDarkMode ? '#121212' : '#FFFFFF',
                '&:hover': {
                  bgcolor: isDarkMode ? '#42a5f5' : '#303f9f',
                },
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
              }}
            >
              Discover Movies
            </Button>
          </Box>
        )}
      </Box>
    </CustomContainer>
  );
};

export default FavoritesPage; 