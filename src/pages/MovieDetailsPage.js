import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  Button, 
  Divider, 
  CircularProgress, 
  Alert,
  Tabs,
  Tab,  
  Stack,
} from '@mui/material';
import { 
  ArrowBack, 
  Favorite, 
  FavoriteBorder,
  AccessTime,
  Star,
  PlayArrow, 
  Category,
  ThumbUp
} from '@mui/icons-material';
import { fetchMovieDetails, fetchSimilarMovies, getImagePath, getYoutubeUrl } from '../services/tmdbApi';
import { formatDate, formatRuntime, formatNumber } from '../utils/helpers';
import { useFavorites } from '../hooks/useFavorites';

import MovieCard from '../components/MovieCard';
import CustomContainer from '../components/Container';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  
  const isMovieFavorite = movie ? isFavorite(movie.id) : false;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const movieData = await fetchMovieDetails(id);
        console.log('Movie data structure:', movieData);
        setMovie(movieData);
        
        const similar = await fetchSimilarMovies(id);
        setSimilarMovies(similar.slice(0, 8)); // Limit to 8 similar movies
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (isMovieFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Find trailer video
  const trailer = movie?.videos?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || movie?.videos?.[0];

  // Function to extract directors from crew data
  const getDirectors = () => {
    if (!movie?.crew) return null;
    
    const directors = movie.crew
      .filter(person => person.job === 'Director')
      .map(director => director.name);
      
    return directors.length ? directors.join(', ') : null;
  };
  
  // Function to extract writers from crew data
  const getWriters = () => {
    if (!movie?.crew) return null;
    
    const writers = movie.crew
      .filter(person => 
        person.job === 'Screenplay' || 
        person.job === 'Writer' || 
        person.job === 'Story'
      )
      .map(writer => writer.name);
      
    return [...new Set(writers)].length ? [...new Set(writers)].join(', ') : null;
  };

  // Function to open trailer in a new tab
  const openTrailer = () => {
    if (trailer?.key) {
      window.open(getYoutubeUrl(trailer.key), '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress sx={{ color: theme => theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!movie) {
    return (
      <Alert severity="info" sx={{ my: 4 }}>
        Movie not found
      </Alert>
    );
  }

  const tabContent = [
    // Overview tab with Movie Info integrated
    <Box key="overview">
      <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
        Synopsis
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
        {movie.overview || 'No synopsis available.'}
      </Typography>
      
      {/* Movie Info Section - moved from sidebar */}
      <Box 
        sx={{ 
          mt: 4, 
          mb: 3, 
          p: 3, 
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '0 4px 16px rgba(0,0,0,0.3)' 
            : '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Movie Info
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime fontSize="small" color="action" sx={{ mr: 1.5 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Runtime</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatRuntime(movie.runtime) || 'Unknown'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Category fontSize="small" color="action" sx={{ mr: 1.5 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Genre</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {movie.genres?.map(g => g.name).join(', ') || 'Unknown'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star fontSize="small" color="action" sx={{ mr: 1.5 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Rating</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {movie.adult ? "R" : "PG-13"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ThumbUp fontSize="small" color="action" sx={{ mr: 1.5 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">User Score</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {`${Math.round((movie.vote_average / 10) * 100)}% (${formatNumber(movie.vote_count)} votes)`}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600}>Director</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {movie.director || getDirectors() || 'Unknown'}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight={600}>Release Date</Typography>
          <Typography variant="body1" color="text.secondary">
            {formatDate(movie.release_date) || 'Unknown'}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600}>Writers</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {movie.writers || getWriters() || 'Unknown'}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight={600}>Runtime</Typography>
          <Typography variant="body1" color="text.secondary">
            {formatRuntime(movie.runtime) || 'Unknown'}
          </Typography>
        </Grid>
      </Grid>
    </Box>,
    
    // Cast & Crew tab
    <Box key="cast" sx={{ mt: 3 }}>
      {movie.cast && movie.cast.length > 0 ? (
        <Grid container spacing={2}>
          {movie.cast.map((person) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={person.id}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: theme => theme.palette.background.paper,
                  transition: 'transform 0.2s',
                  height: '100%',
                  '&:hover': {
                    transform: 'scale(1.03)',
                  }
                }}
              >
                <img
                  src={
                    person.profile_path
                      ? getImagePath(person.profile_path, 'w185')
                      : '/placeholder-person.jpg'
                  }
                  alt={person.name}
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                />
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {person.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {person.character}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No cast information available.
        </Typography>
      )}
    </Box>,
    
    // Similar Movies tab
    <Box key="similar" sx={{ mt: 3 }}>
      {similarMovies.length > 0 ? (
        <Grid container spacing={3}>
          {similarMovies.map(movie => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3} 
              xl={2.4} 
              key={movie.id}
              sx={{ 
                height: { xs: 'auto', sm: '440px' }, 
                display: 'flex'
              }}
            >
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No similar movies found.
        </Typography>
      )}
    </Box>
  ];

  return (
    <>
      {/* Movie Backdrop */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          minHeight: '750px',
          top: 0,
          left: 0,
          zIndex: -1,
          backgroundImage: movie.backdrop_path 
            ? `url(${getImagePath(movie.backdrop_path, 'original')})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: theme => `linear-gradient(to bottom, 
              rgba(0,0,0,0.2) 0%, 
              rgba(0,0,0,0.7) 50%, 
              ${theme.palette.background.default} 100%)`,
          }
        }}
      />
      
      <CustomContainer 
        sx={{ 
          py: 4,
          position: 'relative',
          zIndex: 1,
          mt: { xs: 0, sm: 1, md: 2 },
        }}
      >
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleGoBack}
          sx={{ 
            mb: 4,
            color: theme => theme.palette.mode === 'dark' ? 'white' : 'inherit' 
          }}
          variant="text"
          color="inherit"
        >
          Back
        </Button>

        <Grid container spacing={4}>
       
          <Grid item xs={12} sm={4} md={3}>
            <Paper 
              elevation={5} 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                bgcolor: 'background.paper',
                mb: 3,
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '0 8px 24px rgba(0,0,0,0.4)' 
                  : '0 8px 24px rgba(0,0,0,0.15)'
              }}
            >
              <img 
                src={movie.poster_path ? getImagePath(movie.poster_path, 'w500') : '/placeholder.jpg'} 
                alt={movie.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Paper>
          </Grid>
          
        
          <Grid item xs={12} sm={8} md={9}>
            <Box sx={{ 
              mb: 2,
              color: theme => theme.palette.mode === 'dark' ? 'white' : 'text.primary',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label="HD" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white', 
                    fontWeight: 'bold',
                    mr: 1
                  }} 
                />
                <Chip 
                  label={movie.adult ? "R" : "PG-13"} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'background.paper', 
                    border: '1px solid',
                    borderColor: 'divider',
                    mr: 1
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {movie.release_date?.split('-')[0] || '2023'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>•</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatRuntime(movie.runtime) || '120 min'}
                </Typography>
              </Box>
              
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                {movie.title || 'Movie Title [id]'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star sx={{ color: '#FFC107', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" fontWeight={500} sx={{ mr: 1 }}>
                  {(movie.vote_average / 2).toFixed(1)}/5
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>•</Typography>
                {movie.genres?.slice(0, 3).map((genre, index, array) => (
                  <React.Fragment key={genre.id}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      {genre.name}
                    </Typography>
                    {index < array.length - 1 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>•</Typography>
                    )}
                  </React.Fragment>
                ))}
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<PlayArrow />}
                  onClick={openTrailer}
                  disabled={!trailer?.key}
                  sx={{ 
                    borderRadius: 1,
                    px: 3
                  }}
                >
                  Watch Trailer
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={isMovieFavorite ? <Favorite /> : <FavoriteBorder />}
                  onClick={handleFavoriteToggle}
                  sx={{ 
                    borderRadius: 1,
                    color: isMovieFavorite ? 'error.main' : 'text.primary',
                    borderColor: isMovieFavorite ? 'error.main' : 'divider'
                  }}
                >
                  Add to Watchlist
                </Button>
              </Stack>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  mb: 2,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 'unset',
                    px: 2
                  },
                  '& .Mui-selected': {
                    color: 'error.main'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'error.main'
                  }
                }}
              >
                <Tab label="Overview" />
                <Tab label="Cast & Crew" />
                <Tab label="Similar Movies" />
              </Tabs>
              
              <Divider sx={{ mb: 2 }} />
              
              {tabContent[activeTab]}
            </Box>
          </Grid>
        </Grid>
      </CustomContainer>
    </>
  );
};

export default MovieDetailsPage;