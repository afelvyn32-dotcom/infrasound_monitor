import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0f1d' }}>
        <div style={{ color: '#06b6d4', fontSize: '1.2rem', fontFamily: 'monospace' }}>
          Initializing Infrasound Telemetry Terminal...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // If a regular user tries to access an admin route, redirect to user dashboard
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};
