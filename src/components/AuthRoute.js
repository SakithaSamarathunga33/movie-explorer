import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

const AuthRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRoute; 