import React, { useState, useEffect } from 'react';
import { Paper, InputBase, IconButton, Box, Collapse, useTheme, Typography } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import FilterPanel from './FilterPanel';
import { useMovies } from '../hooks/useMovies';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { searchMovies, setOnSearchReset } = useMovies();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    // Register the reset callback
    setOnSearchReset(() => () => {
      setInput('');
      setSearchSuggestions([]);
      setShowSuggestions(false);
    });
  }, [setOnSearchReset]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Get existing searches from localStorage
      const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      // Add new search to the beginning and keep only unique values
      const updatedSearches = [input.trim(), ...searches.filter(s => s !== input.trim())]
        .slice(0, 4); // Keep only the latest 4 searches
      
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      if (onSearch) {
        onSearch(input.trim());
      } else {
        searchMovies(input.trim());
      }
    }
  };

  const handleFocus = () => {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    if (recentSearches.length > 0) {
      setSearchSuggestions(recentSearches);
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    searchMovies(suggestion);
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative', mb: onSearch ? 0 : 4 }}>
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
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showSuggestions && searchSuggestions.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 9999,
              bgcolor: isDarkMode ? '#333' : '#fff',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '0 0 4px 4px',
              mt: 0.5,
              overflow: 'hidden',
            }}
          >
            {searchSuggestions.map((suggestion, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isDarkMode ? '#444' : '#f0f0f0',
                  },
                  borderBottom: index < searchSuggestions.length - 1 ? 
                    (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)') : 'none'
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Typography variant="body2" sx={{ color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.7)' }}>
                  <SearchIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                  {suggestion}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
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