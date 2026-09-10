import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { UserLayout } from './components/layout/UserLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// User Experience Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { LiveMonitoring } from './pages/user/LiveMonitoring';
import { HistoricalData } from './pages/user/HistoricalData';
import { InfrasoundEvents } from './pages/user/InfrasoundEvents';
import { UserAlerts } from './pages/user/UserAlerts';
import { UserReports } from './pages/user/UserReports';
import { UserProfile } from './pages/user/UserProfile';

// Admin Experience Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SensorManagement } from './pages/admin/SensorManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminAlerts } from './pages/admin/AdminAlerts';
import { AdminReports } from './pages/admin/AdminReports';
import { SystemSettings } from './pages/admin/SystemSettings';

export const App = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0f1d',
        color: '#06b6d4',
        fontFamily: 'monospace'
      }}>
        Initializing Infrasound Telemetry Terminal...
      </div>
    );
  }

  return (
    <Routes>
      {/* Root redirect based on role */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/user/dashboard" replace />
          )
        }
      />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? (isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/dashboard" replace />) : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? (isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/dashboard" replace />) : <Register />}
      />

      {/* USER EXPERIENCE (Protected for authenticated users) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/live" element={<LiveMonitoring />} />
          <Route path="/user/historical" element={<HistoricalData />} />
          <Route path="/user/events" element={<InfrasoundEvents />} />
          <Route path="/user/alerts" element={<UserAlerts />} />
          <Route path="/user/reports" element={<UserReports />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* ADMIN EXPERIENCE (Protected for ADMIN role only) */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/sensors" element={<SensorManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/alerts" element={<AdminAlerts />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
