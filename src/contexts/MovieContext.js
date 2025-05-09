import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  fetchTrendingMovies, 
  searchMovies, 
  fetchGenres, 
  discoverMovies as apiDiscoverMovies,
  fetchPopularMovies as apiFetchPopularMovies,
  fetchTopRatedMovies as apiFetchTopRatedMovies,
  fetchUpcomingMovies as apiFetchUpcomingMovies
} from '../services/tmdbApi';

export const MovieContext = createContext({
  movies: [],
  trendingMovies: [],
  loading: false,
  error: null,
  totalResults: 0,
  currentPage: 1,
  genres: [],
  filters: {
    year: '',
    genreId: '',
    minRating: 0,
  },
  searchQuery: '',
  searchMovies: () => {},
  loadMoreMovies: () => {},
  setFilters: () => {},
  resetFilters: () => {},
  fetchTrendingMovies: () => {},
  fetchGenres: () => {},
  discoverMovies: () => {},
  handlePageChange: () => {},
  fetchPopularMovies: () => {},
  fetchTopRatedMovies: () => {},
  fetchUpcomingMovies: () => {},
  setOnSearchReset: () => {},
});

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    year: '',
    genreId: '',
    minRating: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [onSearchReset, setOnSearchReset] = useState(() => () => {});

  // Fetch genres function
  const fetchGenreList = useCallback(async () => {
    try {
      const genresData = await fetchGenres();
      setGenres(genresData);
      return genresData;
    } catch (err) {
      console.error('Failed to fetch genres:', err);
      setError('Failed to fetch genres. Please try again later.');
      throw err;
    }
  }, []);

  // Fetch trending movies function
  const getTrendingMovies = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await fetchTrendingMovies();
      setTrendingMovies(results);
      return results;
    } catch (err) {
      console.error('Failed to fetch trending movies:', err);
      setError('Failed to fetch trending movies. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch genres on mount
  useEffect(() => {
    fetchGenreList();
  }, [fetchGenreList]);

  // Fetch trending movies on mount
  useEffect(() => {
    getTrendingMovies();
  }, [getTrendingMovies]);

  // Function to search movies with filters applied
  const searchForMovies = useCallback(async (query, page = 1, newFilters = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const { results, total_results, total_pages } = await searchMovies(
        query, 
        page, 
        currentFilters.year, 
        currentFilters.genreId, 
        currentFilters.minRating
      );
      
      if (page === 1) {
        setMovies(results);
      } else {
        setMovies(prev => [...prev, ...results]);
      }
      
      setTotalResults(total_results);
      setCurrentPage(page);
      setSearchQuery(query);
      
      return {
        results,
        total_results,
        total_pages
      };
    } catch (err) {
      console.error('Failed to search movies:', err);
      setError('Failed to search movies. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Discover movies with filters
  const discover = useCallback(async (filterParams, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiDiscoverMovies(filterParams, page);
      
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setTotalResults(data.total_results);
      setCurrentPage(page);
      
      return data;
    } catch (err) {
      console.error('Failed to discover movies:', err);
      setError('Failed to discover movies. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch popular movies
  const getPopularMovies = useCallback(async (page = 1) => {
    try {
      return await apiFetchPopularMovies(page);
    } catch (err) {
      console.error('Failed to fetch popular movies:', err);
      setError('Failed to fetch popular movies. Please try again later.');
      throw err;
    }
  }, []);

  // Fetch top rated movies
  const getTopRatedMovies = useCallback(async (page = 1) => {
    try {
      return await apiFetchTopRatedMovies(page);
    } catch (err) {
      console.error('Failed to fetch top rated movies:', err);
      setError('Failed to fetch top rated movies. Please try again later.');
      throw err;
    }
  }, []);

  // Fetch upcoming movies
  const getUpcomingMovies = useCallback(async (page = 1) => {
    try {
      return await apiFetchUpcomingMovies(page);
    } catch (err) {
      console.error('Failed to fetch upcoming movies:', err);
      setError('Failed to fetch upcoming movies. Please try again later.');
      throw err;
    }
  }, []);

  // Load more movies (pagination)
  const loadMoreMovies = useCallback(() => {
    if (loading || movies.length >= totalResults) return;
    
    searchForMovies(searchQuery, currentPage + 1);
  }, [loading, movies.length, totalResults, searchQuery, currentPage, searchForMovies]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // If we have an active search, apply the new filters
    if (searchQuery) {
      searchForMovies(searchQuery, 1, { ...filters, ...newFilters });
    }
  }, [filters, searchQuery, searchForMovies]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      year: '',
      genreId: '',
      minRating: 0,
    };
    setFilters(defaultFilters);
    
    // If we have an active search, apply the reset filters
    if (searchQuery) {
      searchForMovies(searchQuery, 1, defaultFilters);
    }
    onSearchReset(); // Call the search reset callback
  }, [searchQuery, searchForMovies, onSearchReset]);

  // Handle page change for pagination
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    
    if (searchQuery) {
      searchForMovies(searchQuery, page);
    }
  }, [searchQuery, searchForMovies]);

  return (
    <MovieContext.Provider
      value={{
        movies,
        trendingMovies,
        loading,
        error,
        totalResults,
        currentPage,
        genres,
        filters,
        searchQuery,
        searchMovies: searchForMovies,
        loadMoreMovies,
        setFilters: updateFilters,
        resetFilters,
        fetchTrendingMovies: getTrendingMovies,
        fetchGenres: fetchGenreList,
        discoverMovies: discover,
        handlePageChange,
        fetchPopularMovies: getPopularMovies,
        fetchTopRatedMovies: getTopRatedMovies,
        fetchUpcomingMovies: getUpcomingMovies,
        setOnSearchReset
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};