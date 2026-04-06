// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const employee = localStorage.getItem('employee');

  if (!employee) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;