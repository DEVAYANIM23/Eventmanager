import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
  const logout = useAuthStore((state) => state.logout);

  const location = useLocation();

  // Function to check if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-blue-600 shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          Event Manager
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-4">
            {/* Home Link */}
            <li>
              <Link
                to="/"
                className={`px-4 py-2 w-32 text-center rounded font-bold ${
                  isActive('/')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-blue-500 hover:shadow'
                }`}
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
                    className={`px-4 py-2 w-32 text-center rounded font-bold ${
                      isActive('/login')
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-white hover:bg-blue-500 hover:shadow'
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className={`px-4 py-2 w-32 text-center rounded font-bold ${
                      isActive('/signup')
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-white hover:bg-blue-500 hover:shadow'
                    }`}
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
                  className={`px-4 py-2 w-32 text-center rounded font-bold ${
                    isActive('/admin')
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-green-500 text-white hover:bg-green-400 hover:shadow'
                  }`}
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
                  className={`px-4 py-2 w-32 text-center rounded font-bold ${
                    isActive('/dashboard')
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:bg-blue-500 hover:shadow'
                  }`}
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
                  className="px-4 py-2 w-32 text-center rounded font-bold bg-red-500 text-white hover:bg-red-400 hover:shadow"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
