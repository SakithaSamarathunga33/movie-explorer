import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Grid, Box, Button, CircularProgress, Alert,  Paper, Divider } from '@mui/material';
import { ClearAll, LocalMovies, TrendingUp, Star, Theaters, Whatshot } from '@mui/icons-material';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { useTheme } from '../hooks/useTheme';
import { useMovies } from '../hooks/useMovies';
import CustomContainer from '../components/Container';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [errorSearch, setErrorSearch] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const { mode } = useTheme();
  const { fetchGenres, searchMovies, fetchTrendingMovies, discoverMovies, fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies } = useMovies();
  const theme = useTheme();
  const isDarkMode = mode === 'dark';

  // Generate years for filter (last 20 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => currentYear - index);

  // Generate rating options (0-10 with 1 unit steps)
  const ratings = Array.from(new Array(11), (val, index) => index);

  useEffect(() => {
    const fetchAllMovieData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all movie data in parallel
        const [trending, popular, topRated, upcoming, genreList] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchUpcomingMovies(),
          fetchGenres()
        ]);
        
        setTrendingMovies(trending.slice(0, 12));
        setPopularMovies(popular.slice(0, 12));
        setTopRatedMovies(topRated.slice(0, 12));
        setUpcomingMovies(upcoming.slice(0, 12));
        setGenres(genreList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err.message || 'Failed to load movies');
        setLoading(false);
      }
    };

    fetchAllMovieData();
  }, [fetchTrendingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchGenres]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSearchPage(1); // Reset to first page for new search
    setSearchResults([]);
    setErrorSearch(null);
    setLoadingSearch(true);
    // Clear filters when performing a new search
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');

    try {
      const data = searchMovies(query, 1);
      setSearchResults(data.results);
      setTotalPages(data.total_pages);
      setLoadingSearch(false);
    } catch (err) {
      setErrorSearch(err.message || 'Failed to search movies');
      setLoadingSearch(false);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setErrorSearch(null);
    setTotalPages(0);
  };

  const handleFilterChange = useCallback(async () => {
    if (!selectedGenre && !selectedYear && !selectedRating) return;
    
    setSearchQuery(''); // Clear search query when filters are applied
    setSearchPage(1); // Reset to first page for new filter
    setSearchResults([]);
    setErrorSearch(null);
    setLoadingSearch(true);

    const filters = {};
    if (selectedGenre) filters.with_genres = selectedGenre;
    if (selectedYear) filters.primary_release_year = selectedYear;
    if (selectedRating) filters['vote_average.gte'] = selectedRating;

    try {
      const data = discoverMovies(filters, 1);
      setSearchResults(data.results);
      setTotalPages(data.total_pages);
      setLoadingSearch(false);
    } catch (err) {
      setErrorSearch(err.message || 'Failed to filter movies');
      setLoadingSearch(false);
    }
  }, [selectedGenre, selectedYear, selectedRating, discoverMovies]);

  useEffect(() => {
    // Trigger filter change when filter states change, but not on initial render
    if (selectedGenre || selectedYear || selectedRating) {
      handleFilterChange();
    }
  }, [selectedGenre, selectedYear, selectedRating, handleFilterChange]);

  const handleLoadMore = async () => {
    const nextPage = searchPage + 1;
    setLoadingSearch(true);
    setErrorSearch(null);

    const filters = {};
    if (selectedGenre) filters.with_genres = selectedGenre;
    if (selectedYear) filters.primary_release_year = selectedYear;
    if (selectedRating) filters['vote_average.gte'] = selectedRating;

    try {
      let data;
      if (searchQuery) {
        data = searchMovies(searchQuery, nextPage);
      } else if (selectedGenre || selectedYear || selectedRating) {
        data = discoverMovies(filters, nextPage);
      } else {
         // Should not happen if logic is correct, but as a fallback
         setLoadingSearch(false);
         return;
      }
      setSearchResults([...searchResults, ...data.results]);
      setSearchPage(nextPage);
      setLoadingSearch(false);
    } catch (err) {
      setErrorSearch(err.message || 'Failed to load more movies');
      setLoadingSearch(false);
    }
  };

  // Whether we're showing search results or filtered results
  const isShowingSearchResults = searchQuery || selectedGenre || selectedYear || selectedRating;
  
  // Determine which movies to display
  const displayMovies = isShowingSearchResults ? searchResults : [];
  
  // Main loading state
  const isLoading = isShowingSearchResults ? loadingSearch : loading;
  
  // Main error state
  const displayError = isShowingSearchResults ? errorSearch : error;

  // Category flag - only show categories if not searching or filtering
  const showCategories = !isShowingSearchResults;

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

  // Movie category header with icon
  const CategoryHeader = ({ title, icon, count }) => (
    <Box sx={{ 
      mb: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Typography 
        variant="h5" 
        component="h2"
        sx={{ 
          fontWeight: 700, 
          color: isDarkMode ? '#FFFFFF' : 'inherit',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {icon}
        <span style={{ marginLeft: '8px' }}>{title}</span>
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: isDarkMode ? '#B3B3B3' : 'text.secondary',
          fontWeight: 500
        }}
      >
        {count} {count === 1 ? 'movie' : 'movies'}
      </Typography>
    </Box>
  );

  // Movie grid section - fix the icon rendering issue
  const MovieGridSection = ({ title, movies, loading, icon }) => {
    return (
      <Box sx={{ mb: 6, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3} 
                xl={2.4} 
                key={index}
                sx={{ height: '420px' }}
              >
                <MovieCardSkeleton />
              </Grid>
            ))
          ) : (
            // Movie cards
            movies.slice(0, 6).map(movie => (
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
            ))
          )}
        </Grid>
      </Box>
    );
  }

  // Add click outside handler to close menus when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      const genreButton = document.getElementById('genre-button');
      const yearButton = document.getElementById('year-button');
      const ratingButton = document.getElementById('rating-button');
      
      const genreMenu = document.getElementById('genre-menu');
      const yearMenu = document.getElementById('year-menu');
      const ratingMenu = document.getElementById('rating-menu');
      
      if (
        genreMenu && 
        genreButton && 
        !genreButton.contains(event.target) && 
        !genreMenu.contains(event.target)
      ) {
        genreMenu.style.display = 'none';
      }
      
      if (
        yearMenu && 
        yearButton && 
        !yearButton.contains(event.target) && 
        !yearMenu.contains(event.target)
      ) {
        yearMenu.style.display = 'none';
      }
      
      if (
        ratingMenu && 
        ratingButton && 
        !ratingButton.contains(event.target) && 
        !ratingMenu.contains(event.target)
      ) {
        ratingMenu.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(to bottom, #000000, #121212)' 
        : 'linear-gradient(to bottom, #f5f5f5, #ffffff)'
    }}>
      <CustomContainer>
        {/* Hero Section */}
        {showCategories && !loading && !error && (
          <Box sx={{ 
            py: 6, 
            textAlign: 'center',
            mb: 4
          }}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontWeight: 900, 
                color: isDarkMode ? '#FFFFFF' : '#212121',
                mb: 2,
                textShadow: isDarkMode ? '0 2px 10px rgba(144, 202, 249, 0.3)' : 'none'
              }}
            >
              <LocalMovies sx={{ fontSize: 40, mr: 1, verticalAlign: 'bottom', color: isDarkMode ? '#90CAF9' : '#3F51B5' }} />
              Movie Explorer
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: isDarkMode ? '#B3B3B3' : '#757575',
                maxWidth: 600,
                mx: 'auto',
                mb: 4
              }}
            >
              Discover trending movies, find new favorites, and explore thousands of titles
            </Typography>
          </Box>
        )}

        {/* Search Bar */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar onSearch={handleSearch} />
          </Box>
          {isShowingSearchResults && (
            <Button
              variant="outlined"
              startIcon={<ClearAll />}
              onClick={handleResetSearch}
              sx={{
                ml: 2,
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                color: isDarkMode ? '#FFFFFF' : '#1976d2',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(25, 118, 210, 0.04)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(25, 118, 210, 0.5)',
                }
              }}
            >
              Reset
            </Button>
          )}
        </Box>

        {/* Filter Controls */}
        <Paper 
          elevation={isDarkMode ? 8 : 3}
          sx={{ 
            p: { xs: 2, sm: 3 },
            mb: 4, 
            borderRadius: 2,
            bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: isDarkMode 
              ? '0 8px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: isDarkMode 
                ? '0 10px 25px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                : '0 6px 20px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)'
            },
            position: 'relative',
            zIndex: 1000
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            pb: 1.5,
            borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
          }}>
            <Box 
              sx={{ 
                height: 20, 
                width: 4, 
                bgcolor: isDarkMode ? '#90CAF9' : '#3F51B5',
                mr: 2,
                borderRadius: 1
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: isDarkMode ? '#FFFFFF' : '#333333',
                letterSpacing: '0.5px'
              }}
            >
              Filter Movies
            </Typography>
            
            {/* Active filter indicator */}
            {(selectedGenre || selectedYear || selectedRating) && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                ml: 2,
                backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.1)',
                borderRadius: '12px',
                px: 1.5,
                py: 0.3,
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: isDarkMode ? '#90CAF9' : '#3F51B5',
                    letterSpacing: '0.5px',
                  }}
                >
                  Filters active
                </Typography>
              </Box>
            )}
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Clear filters button - only show when there are active filters */}
            {(selectedGenre || selectedYear || selectedRating) && (
              <Button
                size="small"
                variant="text"
                startIcon={<ClearAll sx={{ fontSize: 16 }} />}
                onClick={() => {
                  setSelectedGenre('');
                  setSelectedYear('');
                  setSelectedRating('');
                  setSearchResults([]);
                  setSearchQuery('');
                }}
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                }}
              >
                Clear All
              </Button>
            )}
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ position: 'relative', width: '100%' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 0.5,
                    fontWeight: 600,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Genre
                </Typography>
                <Button
                  id="genre-button"
                  fullWidth
                  onClick={(e) => {
                    const menu = document.getElementById('genre-menu');
                    if (menu) {
                      const isVisible = menu.style.display === 'block';
                      
                      // Hide all menus first
                      document.getElementById('genre-menu').style.display = 'none';
                      document.getElementById('year-menu').style.display = 'none';
                      document.getElementById('rating-menu').style.display = 'none';
                      
                      // Then show this one if it wasn't visible
                      if (!isVisible) {
                        menu.style.display = 'block';
                      }
                    }
                  }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: '38px',
                    padding: '8px 12px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 1,
                    color: '#555',
                    textTransform: 'none',
                    fontWeight: 400,
                    textAlign: 'left',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#e8e8e8',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <span>
                    {selectedGenre 
                      ? (genres.find(g => g.id === selectedGenre)?.name || 'All Genres')
                      : 'All Genres'}
                  </span>
                  <span>▾</span>
                </Button>
                <Paper
                  id="genre-menu"
                  sx={{
                    position: 'absolute',
                    top: 'calc(100% + 2px)',
                    left: 0,
                    right: 0,
                    zIndex: 10000,
                    mt: 0.5,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    display: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    bgcolor: isDarkMode ? '#1E1E1E' : '#ffffff',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      p: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 1, 
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        },
                        ...(selectedGenre === '' && {
                          bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                        }),
                      }}
                      onClick={() => {
                        setSelectedGenre('');
                        document.getElementById('genre-menu').style.display = 'none';
                      }}
                    >
                      <em>All Genres</em>
                    </Box>
                    {genres.map((genre) => (
                      <Box 
                        key={genre.id} 
                        sx={{ 
                          p: 1, 
                          cursor: 'pointer',
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                          },
                          ...(selectedGenre === genre.id && {
                            bgcolor: isDarkMode ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.08)',
                          }),
                        }}
                        onClick={() => {
                          setSelectedGenre(genre.id);
                          document.getElementById('genre-menu').style.display = 'none';
                        }}
                      >
                        {genre.name}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ position: 'relative', width: '100%' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 0.5,
                    fontWeight: 600,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Release Year
                </Typography>
                <Button
                  id="year-button"
                  fullWidth
                  onClick={(e) => {
                    const menu = document.getElementById('year-menu');
                    if (menu) {
                      const isVisible = menu.style.display === 'block';
                      
                      // Hide all menus first
                      document.getElementById('genre-menu').style.display = 'none';
                      document.getElementById('year-menu').style.display = 'none';
                      document.getElementById('rating-menu').style.display = 'none';
                      
                      // Then show this one if it wasn't visible
                      if (!isVisible) {
                        menu.style.display = 'block';
                      }
                    }
                  }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: '38px',
                    padding: '8px 12px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 1,
                    color: '#555',
                    textTransform: 'none',
                    fontWeight: 400,
                    textAlign: 'left',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#e8e8e8',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <span>{selectedYear || 'All Years'}</span>
                  <span>▾</span>
                </Button>
                <Paper
                  id="year-menu"
                  sx={{
                    position: 'absolute',
                    top: 'calc(100% + 2px)',
                    left: 0,
                    right: 0,
                    zIndex: 10000,
                    mt: 0.5,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    display: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    bgcolor: isDarkMode ? '#1E1E1E' : '#ffffff',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      p: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 1, 
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        },
                        ...(selectedYear === '' && {
                          bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                        }),
                      }}
                      onClick={() => {
                        setSelectedYear('');
                        document.getElementById('year-menu').style.display = 'none';
                      }}
                    >
                      <em>All Years</em>
                    </Box>
                    {years.map((year) => (
                      <Box 
                        key={year} 
                        sx={{ 
                          p: 1, 
                          cursor: 'pointer',
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                          },
                          ...(selectedYear === year && {
                            bgcolor: isDarkMode ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.08)',
                          }),
                        }}
                        onClick={() => {
                          setSelectedYear(year);
                          document.getElementById('year-menu').style.display = 'none';
                        }}
                      >
                        {year}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ position: 'relative', width: '100%' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 0.5,
                    fontWeight: 600,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Minimum Rating
                </Typography>
                <Button
                  id="rating-button"
                  fullWidth
                  onClick={(e) => {
                    const menu = document.getElementById('rating-menu');
                    if (menu) {
                      const isVisible = menu.style.display === 'block';
                      
                      // Hide all menus first
                      document.getElementById('genre-menu').style.display = 'none';
                      document.getElementById('year-menu').style.display = 'none';
                      document.getElementById('rating-menu').style.display = 'none';
                      
                      // Then show this one if it wasn't visible
                      if (!isVisible) {
                        menu.style.display = 'block';
                      }
                    }
                  }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: '38px',
                    padding: '8px 12px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 1,
                    color: '#555',
                    textTransform: 'none',
                    fontWeight: 400,
                    textAlign: 'left',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#e8e8e8',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    {selectedRating ? (
                      <>
                        {selectedRating} {selectedRating > 0 && (
                          <Star sx={{ fontSize: 14, ml: 0.5, color: '#FFC107' }} />
                        )}
                      </>
                    ) : (
                      'Any Rating'
                    )}
                  </Box>
                  <span>▾</span>
                </Button>
                <Paper
                  id="rating-menu"
                  sx={{
                    position: 'absolute',
                    top: 'calc(100% + 2px)',
                    left: 0,
                    right: 0,
                    zIndex: 10000,
                    mt: 0.5,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    display: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    bgcolor: isDarkMode ? '#1E1E1E' : '#ffffff',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      p: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 1, 
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        },
                        ...(selectedRating === '' && {
                          bgcolor: isDarkMode ? 'rgba(229, 9, 20, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                        }),
                      }}
                      onClick={() => {
                        setSelectedRating('');
                        document.getElementById('rating-menu').style.display = 'none';
                      }}
                    >
                      <em>Any Rating</em>
                    </Box>
                    {ratings.map((rating) => (
                      <Box 
                        key={rating} 
                        sx={{ 
                          p: 1, 
                          cursor: 'pointer',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                          },
                          ...(selectedRating === rating && {
                            bgcolor: isDarkMode ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.08)',
                          }),
                        }}
                        onClick={() => {
                          setSelectedRating(rating);
                          document.getElementById('rating-menu').style.display = 'none';
                        }}
                      >
                        {rating} {rating > 0 && <Star sx={{ fontSize: 14, ml: 0.5, color: '#FFC107' }} />}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {displayError && (
          <Alert 
            severity="error"
            sx={{ 
              my: 3,
              bgcolor: isDarkMode ? 'rgba(207, 102, 121, 0.1)' : 'rgba(255, 64, 129, 0.1)', 
              color: isDarkMode ? '#FFFFFF' : 'inherit',
              border: isDarkMode ? '1px solid rgba(207, 102, 121, 0.3)' : '1px solid rgba(255, 64, 129, 0.3)'
            }}
          >
            Error: {displayError}
          </Alert>
        )}

        {isLoading && (
          <Box display="flex" justifyContent="center" sx={{ my: 8 }}>
            <CircularProgress sx={{ color: isDarkMode ? '#E50914' : '#1976d2' }} />
          </Box>
        )}

        {/* Search Results */}
        {!isLoading && !displayError && isShowingSearchResults && (
          <>
            {displayMovies.length === 0 ? (
              <Paper sx={{ 
                py: 6, 
                px: 2, 
                my: 3,
                textAlign: 'center',
                bgcolor: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(245, 245, 245, 0.7)',
                borderRadius: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDarkMode ? '#FFFFFF' : 'inherit',
                  }}
                >
                  No results found for your criteria.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: isDarkMode ? '#B3B3B3' : 'text.secondary',
                    mt: 1
                  }}
                >
                  Try adjusting your filters or search terms.
                </Typography>
              </Paper>
            ) : (
              <>
                <Box sx={{ 
                  mb: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography 
                    variant="h4" 
                    component="h2"
                    sx={{ 
                      fontWeight: 700, 
                      color: isDarkMode ? '#FFFFFF' : '#212121',
                      borderLeft: isDarkMode ? `4px solid #90CAF9` : `4px solid #3F51B5`,
                      pl: 2,
                    }}
                  >
                    {searchQuery 
                      ? `Search Results for "${searchQuery}"` 
                      : 'Filtered Movies'}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? '#B3B3B3' : 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    {displayMovies.length} {displayMovies.length === 1 ? 'movie' : 'movies'}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 4, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                
                <Grid container spacing={2}>
                  {displayMovies.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={movie.id}>
                      <MovieCard movie={movie} />
                    </Grid>
                  ))}
                </Grid>

                {searchPage < totalPages && (
                  <Box display="flex" justifyContent="center" sx={{ mt: 6, mb: 4 }}>
                    <Button 
                      variant="contained" 
                      onClick={handleLoadMore}
                      sx={{
                        bgcolor: isDarkMode ? '#90CAF9' : '#3F51B5',
                        color: isDarkMode ? '#121212' : '#FFFFFF',
                        '&:hover': {
                          bgcolor: isDarkMode ? '#42a5f5' : '#303f9f',
                        },
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 1,
                      }}
                    >
                      Load More
                    </Button>
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {/* Movie Categories */}
        {showCategories && !isLoading && !displayError && (
          <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            {/* Trending Movies */}
            <MovieGridSection 
              title="Trending Movies" 
              movies={trendingMovies} 
              loading={loading} 
              icon={<TrendingUp sx={{ mr: 1, color: isDarkMode ? '#90CAF9' : '#3F51B5' }} />} 
            />

            {/* Popular Movies */}
            <MovieGridSection 
              title="Popular Movies" 
              movies={popularMovies} 
              loading={loading} 
              icon={<Whatshot sx={{ mr: 1, color: isDarkMode ? '#90CAF9' : '#3F51B5' }} />} 
            />

            {/* Top Rated Movies */}
            <MovieGridSection 
              title="Top Rated" 
              movies={topRatedMovies} 
              loading={loading} 
              icon={<Star sx={{ mr: 1, color: isDarkMode ? '#90CAF9' : '#3F51B5' }} />} 
            />

            {/* Upcoming Movies */}
            <MovieGridSection 
              title="Coming Soon" 
              movies={upcomingMovies} 
              loading={loading} 
              icon={<Theaters sx={{ mr: 1, color: isDarkMode ? '#90CAF9' : '#3F51B5' }} />} 
            />
          </Box>
        )}
      </CustomContainer>
    </Box>
  );
};

export default HomePage; 