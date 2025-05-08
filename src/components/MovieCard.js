import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Tooltip, useTheme } from '@mui/material';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import { getImagePath } from '../services/tmdbApi';
import { extractYear } from '../utils/helpers';
import { useFavorites } from '../hooks/useFavorites';

const MovieCard = ({ movie, showRating = true }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMovieFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const ratingColor = movie.vote_average >= 7 
    ? '#4CAF50' // good - green
    : movie.vote_average >= 5 
      ? '#FFC107' // average - yellow/amber
      : '#F44336'; // poor - red

  return (
    <Card 
      sx={{ 
        width: '100%',
        height: '420px', // Fixed exact height
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: isDarkMode ? '0 8px 16px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isDarkMode ? '0 12px 24px rgba(0, 0, 0, 0.8)' : '0 12px 24px rgba(0, 0, 0, 0.2)'
        },
        position: 'relative',
        margin: '0 auto',
      }}
      component={Link}
      to={`/movie/${movie.id}`}
      style={{ textDecoration: 'none' }}
    >
      {/* Favorite Button */}
      <IconButton 
        onClick={handleFavoriteToggle}
        size="medium"
        aria-label={isMovieFavorite ? "Remove from favorites" : "Add to favorites"}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          color: isMovieFavorite ? (isDarkMode ? '#F48FB1' : '#FF4081') : '#FFFFFF',
          padding: '8px',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            transform: 'scale(1.1)',
          }
        }}
      >
        {isMovieFavorite ? <Favorite /> : <FavoriteBorder />}
      </IconButton>

      {/* Rating Badge */}
      {showRating && movie.vote_average > 0 && (
        <Box 
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: ratingColor,
            borderRadius: '8px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          <Star fontSize="small" sx={{ mr: 0.5 }} />
          {movie.vote_average.toFixed(1)}
        </Box>
      )}

      <Box sx={{ height: '300px', position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{ 
            height: '300px',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
          image={movie.poster_path ? getImagePath(movie.poster_path, 'w500') : '/placeholder.jpg'}
          alt={movie.title}
        />
      </Box>
      
      <CardContent sx={{ 
        flex: '0 0 120px', 
        width: '100%',
        padding: 2,
        paddingBottom: '16px !important',
        bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      }}>
        <Box>
          <Tooltip title={movie.title} placement="top">
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#FFFFFF' : '#212121',
                mb: 1,
                lineHeight: 1.2,
                height: '2.4em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: '1rem'
              }}
            >
              {movie.title}
            </Typography>
          </Tooltip>
          
          <Typography 
            variant="body2" 
            color={isDarkMode ? '#B3B3B3' : '#757575'}
            sx={{ fontWeight: 500 }}
          >
            {extractYear(movie.release_date)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 