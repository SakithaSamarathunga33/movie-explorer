import React from 'react';
import { Box, Pagination as MuiPagination, useTheme } from '@mui/material';

const Pagination = ({ page, totalPages, onPageChange }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleChange = (event, value) => {
    onPageChange(value);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      mt: 4, 
      mb: 4 
    }}>
      <MuiPagination
        count={totalPages > 500 ? 500 : totalPages}
        page={page}
        onChange={handleChange}
        size="large"
        variant="outlined"
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        sx={{
          '& .MuiPaginationItem-root': {
            color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.87)',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-selected': {
              bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.2)' : 'rgba(25, 118, 210, 0.1)',
              color: isDarkMode ? '#FFFFFF' : theme.palette.primary.main,
              borderColor: isDarkMode ? '#E50914' : theme.palette.primary.main,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.3)' : 'rgba(25, 118, 210, 0.2)',
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default Pagination; 