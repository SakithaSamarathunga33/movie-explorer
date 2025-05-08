import axios from 'axios';

// TMDb API configuration
const API_KEY = '43892a5c5ec694fd4468e9c0e1e8c6f5'; // TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = {
  trending: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
  search: `${BASE_URL}/search/movie?api_key=${API_KEY}`,
  movieDetails: `${BASE_URL}/movie/`,
  genres: `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
  discover: `${BASE_URL}/discover/movie?api_key=${API_KEY}`,
};

// Create axios instance
const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Error handler helper
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // Server responded with an error status
    throw new Error(`API error: ${error.response.status} - ${error.response.data.status_message || error.response.statusText}`);
  } else if (error.request) {
    // Request made but no response
    throw new Error('Network error: No response from server');
  } else {
    // Something else happened setting up the request
    throw new Error(`Request error: ${error.message}`);
  }
};

// Fetch trending movies
export const fetchTrendingMovies = async () => {
  try {
    const response = await tmdbAxios.get('/trending/movie/week');
    return {
      results: response.data.results,
      total_results: response.data.total_results,
      total_pages: response.data.total_pages,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch popular movies
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbAxios.get('/movie/popular', { params: { page } });
    return response.data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbAxios.get('/movie/top_rated', { params: { page } });
    return response.data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch upcoming movies
export const fetchUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbAxios.get('/movie/upcoming', { params: { page } });
    return response.data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

// Search movies with filters
export const searchMovies = async (query, page = 1, year = '', genreId = '', minRating = 0) => {
  try {
    const params = {
      query,
      page,
      include_adult: false,
    };

    // Add optional filters when they are provided
    if (year) params.primary_release_year = year;
    if (genreId) params.with_genres = genreId;
    if (minRating > 0) params.vote_average_gte = minRating;

    const response = await tmdbAxios.get('/search/movie', { params });
    
    return {
      results: response.data.results,
      total_results: response.data.total_results,
      total_pages: response.data.total_pages,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Discover movies with filters
export const discoverMovies = async (filters = {}, page = 1) => {
  try {
    const params = {
      page,
      include_adult: false,
      sort_by: 'popularity.desc',
      ...filters,
    };

    const response = await tmdbAxios.get('/discover/movie', { params });
    
    return {
      results: response.data.results,
      total_results: response.data.total_results,
      total_pages: response.data.total_pages,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch movie details including videos and credits
export const fetchMovieDetails = async (movieId) => {
  try {
    const [movie, videos, credits] = await Promise.all([
      tmdbAxios.get(`/movie/${movieId}`),
      tmdbAxios.get(`/movie/${movieId}/videos`),
      tmdbAxios.get(`/movie/${movieId}/credits`),
    ]);

    return {
      ...movie.data,
      videos: videos.data.results,
      cast: credits.data.cast.slice(0, 10), // Get only first 10 cast members
      crew: credits.data.crew,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch movie genres
export const fetchGenres = async () => {
  try {
    const response = await tmdbAxios.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch similar movies
export const fetchSimilarMovies = async (movieId) => {
  try {
    const response = await tmdbAxios.get(`/movie/${movieId}/similar`);
    return response.data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

// Helper to get full poster/backdrop path
export const getImagePath = (path, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper to get YouTube embed URL
export const getYoutubeUrl = (key) => {
  return `https://www.youtube.com/embed/${key}`;
}; 