import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AlertBanner } from '../common/AlertBanner';

export const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* 1. FIXED LEFT SIDEBAR */}
      <Sidebar
        role="USER"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 2. FIXED TOP HEADER */}
      <Header onToggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* 3. ONLY SCROLLABLE MAIN CONTENT AREA */}
      <div className="main-content">
        <main className="page-container">
          <Outlet />
        </main>
        <AlertBanner />
      </div>
    </div>
  );
};
