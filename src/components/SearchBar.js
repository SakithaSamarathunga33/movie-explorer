import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box, Collapse, useTheme } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import FilterPanel from './FilterPanel';
import { useMovies } from '../hooks/useMovies';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { searchMovies } = useMovies();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (onSearch) {
        onSearch(input.trim());
      } else {
        searchMovies(input.trim());
      }
    }
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <Box sx={{ width: '100%', mb: onSearch ? 0 : 4 }}>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          bgcolor: isDarkMode ? '#1E1E1E' : '#fff',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: isDarkMode ? '0 6px 16px rgba(0, 0, 0, 0.5)' : '0 6px 16px rgba(0, 0, 0, 0.15)',
          },
        }}
        elevation={0}
        onSubmit={handleSearch}
      >
        <InputBase
          sx={{ 
            ml: 2, 
            flex: 1,
            color: isDarkMode ? '#FFFFFF' : 'inherit',
            fontSize: '1.1rem',
            '& input::placeholder': {
              color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.5)',
              opacity: 1,
            }
          }}
          placeholder="Search for movies..."
          inputProps={{ 'aria-label': 'search movies' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <IconButton 
          type="submit" 
          sx={{ 
            p: '10px',
            color: isDarkMode ? '#E50914' : 'primary.main',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.1)' : 'rgba(25, 118, 210, 0.1)',
            }
          }} 
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
        {!onSearch && (
          <IconButton 
            sx={{ 
              p: '10px',
              mr: 1,
              color: showFilters 
                ? (isDarkMode ? '#E50914' : 'primary.main')
                : (isDarkMode ? '#FFFFFF' : 'rgba(0, 0, 0, 0.54)'),
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              }
            }} 
            aria-label="filter options"
            onClick={toggleFilters}
          >
            <FilterIcon />
          </IconButton>
        )}
      </Paper>
      
      {!onSearch && (
        <Collapse in={showFilters} timeout="auto" unmountOnExit>
          <FilterPanel />
        </Collapse>
      )}
    </Box>
  );
};

export default SearchBar; 