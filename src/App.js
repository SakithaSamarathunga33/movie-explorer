import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { MovieProvider } from './contexts/MovieContext';
import Layout from './components/Layout';
import AuthRoute from './components/AuthRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <FavoritesProvider>
          <MovieProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route element={<AuthRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </MovieProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}

export default App;
