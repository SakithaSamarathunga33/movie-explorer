import React from 'react';
import { Card, CardContent, Skeleton, Box, useTheme } from '@mui/material';

const MovieCardSkeleton = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card 
      sx={{ 
        height: '100%',
        minHeight: 380, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: isDarkMode ? '0 8px 16px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
        bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={280} 
        animation="wave"
        sx={{ 
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'
        }}
      />
      
      {/* Content Skeleton */}
      <CardContent sx={{ 
        flexGrow: 1, 
        padding: 2,
        paddingBottom: '16px !important',
      }}>
        <Skeleton 
          variant="text" 
          width="90%" 
          height={32} 
          animation="wave"
          sx={{ 
            mb: 1,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'
          }}
        />
        <Skeleton 
          variant="text" 
          width="40%" 
          animation="wave"
          sx={{ 
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default MovieCardSkeleton; 