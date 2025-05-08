import { useContext } from 'react';
import { ColorModeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ColorModeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProviderWrapper');
  }
  
  return context;
}; 