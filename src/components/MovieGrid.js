import React from 'react';
import { Grid, Box, Typography, Skeleton, useTheme } from '@mui/material';
import MovieCard from './MovieCard';
import Pagination from './Pagination';
import { useMovies } from '../hooks/useMovies';
import MovieCardSkeleton from './MovieCardSkeleton';

const MovieGrid = ({ 
  movies, 
  loading, 
  title, 
  emptyMessage = "No movies found", 
  showPagination = true,
  isSearch = false,
  showEmptyTitle = true
}) => {
  const { currentPage, totalPages, handlePageChange } = useMovies();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Loading skeletons
  if (loading) {
    return (
      <Box sx={{ mt: 3, width: '100%' }}>
        {title && (
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              color: isDarkMode ? '#FFFFFF' : '#212121',
              borderLeft: isDarkMode ? `4px solid #90CAF9` : `4px solid #3F51B5`,
              pl: 2,
            }}
          >
            <Skeleton width="40%" animation="wave" />
          </Typography>
        )}
        <Grid container spacing={3}>
          {[...Array(12)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index} sx={{ height: '420px' }}>
              <MovieCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Empty state
  if (!movies || movies.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 2,
          mt: 3,
          width: '100%',
          bgcolor: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(245, 245, 245, 0.7)',
          borderRadius: 2,
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        {showEmptyTitle && (
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              mb: 2,
              color: isDarkMode ? '#FFFFFF' : '#212121',
            }}
          >
            {title}
          </Typography>
        )}
        <Typography 
          variant="body1" 
          sx={{ 
            color: isDarkMode ? '#B3B3B3' : '#757575',
            mb: 2,
            fontSize: '1.1rem',
          }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      {title && (
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            color: isDarkMode ? '#FFFFFF' : '#212121',
            borderLeft: isDarkMode ? `4px solid #90CAF9` : `4px solid #3F51B5`,
            pl: 2,
          }}
        >
          {title}
        </Typography>
      )}
      <Grid container spacing={3}>
        {movies.map(movie => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            xl={2.4} 
            key={movie.id} 
            sx={{ height: '420px' }}
          >
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
      {showPagination && totalPages > 1 && (
        <Pagination 
          page={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </Box>
  );
};

export default MovieGrid; 