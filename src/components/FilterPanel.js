import React, { useState, useEffect } from 'react';
import { Paper, Box, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Button, Grid, useTheme } from '@mui/material';
import { RestartAlt, FilterAlt } from '@mui/icons-material';
import { useMovies } from '../hooks/useMovies';

const FilterPanel = () => {
  const { genres, filters, setFilters, resetFilters } = useMovies();
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 80 }, (_, i) => currentYear - i);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setLocalFilters({
      ...localFilters,
      [field]: value,
    });
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: isDarkMode ? '#1E1E1E' : '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        '& .MuiMenuItem-root': {
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
          },
          '&.Mui-selected': {
            bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.15)' : 'rgba(25, 118, 210, 0.08)'
          }
        }
      }
    }
  };

  const selectStyles = {
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
    '& .MuiSelect-icon': {
      color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.54)',
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        mt: 2, 
        boxShadow: isDarkMode ? '0 6px 16px rgba(0, 0, 0, 0.4)' : '0 6px 16px rgba(0, 0, 0, 0.1)', 
        borderRadius: 2,
        bgcolor: isDarkMode ? '#1E1E1E' : '#ffffff',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="year-select-label">Release Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={localFilters.year}
              label="Release Year"
              onChange={(e) => handleFilterChange('year', e.target.value)}
              MenuProps={menuProps}
              sx={selectStyles}
            >
              <MenuItem value="">Any Year</MenuItem>
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="genre-select-label">Genre</InputLabel>
            <Select
              labelId="genre-select-label"
              id="genre-select"
              value={localFilters.genreId}
              label="Genre"
              onChange={(e) => handleFilterChange('genreId', e.target.value)}
              MenuProps={menuProps}
              sx={selectStyles}
            >
              <MenuItem value="">Any Genre</MenuItem>
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography 
            gutterBottom
            sx={{ 
              color: isDarkMode ? '#B3B3B3' : 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Minimum Rating</span>
            <span 
              style={{ 
                fontWeight: 600, 
                color: isDarkMode ? '#FFD700' : theme.palette.primary.main 
              }}
            >
              {localFilters.minRating}
            </span>
          </Typography>
          <Slider
            value={localFilters.minRating}
            onChange={(_, newValue) => handleFilterChange('minRating', newValue)}
            step={0.5}
            marks
            min={0}
            max={10}
            valueLabelDisplay="auto"
            sx={{
              color: isDarkMode ? '#E50914' : theme.palette.primary.main,
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0px 0px 0px 8px ${isDarkMode ? 'rgba(229, 9, 20, 0.16)' : 'rgba(25, 118, 210, 0.16)'}`,
                },
              },
              '& .MuiSlider-valueLabel': {
                bgcolor: isDarkMode ? '#E50914' : theme.palette.primary.main,
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleResetFilters}
              startIcon={<RestartAlt />}
              sx={{
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                color: isDarkMode ? '#FFFFFF' : 'rgba(0, 0, 0, 0.87)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                }
              }}
            >
              Reset
            </Button>
            <Button 
              variant="contained" 
              onClick={handleApplyFilters}
              startIcon={<FilterAlt />}
              sx={{
                bgcolor: isDarkMode ? '#E50914' : theme.palette.primary.main,
                '&:hover': {
                  bgcolor: isDarkMode ? '#C00812' : theme.palette.primary.dark,
                },
                fontWeight: 600,
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterPanel; 