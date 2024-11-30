import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import CategoryFilter from './CategoryFilter'; // Make sure you import CategoryFilter

function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
  const logout = useAuthStore((state) => state.logout);

  const location = useLocation();

  // Function to check if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#2563EB',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '17px 0',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
            Event Manager
          </Link>

          {/* Navigation */}
          <nav>
            <ul style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Home Link */}
              <li>
                <Link
                  to="/"
                  style={{
                    padding: '8px 16px',
                    width: '128px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    backgroundColor: isActive('/') ? 'white' : 'transparent',
                    color: isActive('/') ? '#2B6CB0' : 'white',
                    boxShadow: isActive('/') ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  Home
                </Link>
              </li>

              {/* Show Login/Sign Up for unauthenticated users */}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/login"
                      style={{
                        padding: '8px 16px',
                        width: '128px',
                        textAlign: 'center',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        backgroundColor: isActive('/login') ? 'white' : 'transparent',
                        color: isActive('/login') ? '#2B6CB0' : 'white',
                        boxShadow: isActive('/login') ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                        textDecoration: 'none',
                      }}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      style={{
                        padding: '8px 16px',
                        width: '128px',
                        textAlign: 'center',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        backgroundColor: isActive('/signup') ? 'white' : 'transparent',
                        color: isActive('/signup') ? '#2B6CB0' : 'white',
                        boxShadow: isActive('/signup') ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                        textDecoration: 'none',
                      }}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}

              {/* Admin Dashboard for admin users */}
              {isAuthenticated && userRole === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                    style={{
                      padding: '8px 16px',
                      width: '128px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      backgroundColor: isActive('/admin') ? '#38A169' : '#2F855A',
                      color: 'white',
                      boxShadow: isActive('/admin') ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                      textDecoration: 'none',
                    }}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}

              {/* Dashboard for non-admin users */}
              {isAuthenticated && userRole !== 'admin' && (
                <li>
                  <Link
                    to="/dashboard"
                    style={{
                      padding: '8px 16px',
                      width: '128px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      backgroundColor: isActive('/dashboard') ? 'white' : 'transparent',
                      color: isActive('/dashboard') ? '#2B6CB0' : 'white',
                      boxShadow: isActive('/dashboard') ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                      textDecoration: 'none',
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {/* Logout button */}
              {isAuthenticated && (
                <li>
                  <button
                    onClick={logout}
                    style={{
                      padding: '8px 16px',
                      width: '128px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      backgroundColor: '#F56565',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Conditionally render CategoryFilter only on Home page */}
        {location.pathname === '/' && <CategoryFilter selectedCategory={null} setSelectedCategory={null} />}
      </div>
    </header>
  );
}

export default Header;
