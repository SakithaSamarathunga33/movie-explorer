import { useContext } from 'react';
import { MovieContext } from '../contexts/MovieContext';

export const useMovies = () => {
  const context = useContext(MovieContext);
  
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  
  return context;
}; 