import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import supabase from '../../supabaseClient';
import ThemeToggle from '../common/ThemeToggle';

function Navbar({ user }) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed. Please try again.');
    } else {
      toast.success('Logged out successfully');
      setDesktopOpen(false);
      setMobileOpen(false);
      navigate('/');
    }
  };

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target)
      ) {
        setDesktopOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeStyle =
    'text-white bg-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-800 hover:border-blue-800 transition';
  const inactiveStyle =
    'text-gray-950 bg-gray-300 border-2 border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white dark:text-white dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-blue-600 dark:hover:text-white';

  return (
    <nav className="sticky top-0 z-50 bg-slate-100 dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="font-bold text-3xl text-blue-600">
              UNIFIND
            </Link>
          </div>

          {/* Center: Links (Desktop only) */}
          <div className="hidden md:flex space-x-6 items-center absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className={location.pathname === '/' ? activeStyle : inactiveStyle}
            >
              Home
            </Link>
            <Link
              to="/report"
              className={
                location.pathname === '/report' ? activeStyle : inactiveStyle
              }
            >
              Report Item
            </Link>
            <Link
              to="/listings"
              className={
                location.pathname === '/listings' ? activeStyle : inactiveStyle
              }
            >
              View Listings
            </Link>
          </div>

          {/* Right: Theme + User Menu (Desktop) */}
          <div className="hidden md:flex space-x-4 items-center">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={desktopMenuRef}>
                <button
                  onClick={() => setDesktopOpen(!desktopOpen)}
                  className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md shadow-md text-gray-800 dark:text-gray-100 text-sm border border-gray-300 dark:border-gray-600"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span>{user.username || user.email.split('@')[0]}</span>
                </button>

                {desktopOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setDesktopOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={
                    location.pathname === '/login' ? activeStyle : inactiveStyle
                  }
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={
                    location.pathname === '/signup' ? activeStyle : inactiveStyle
                  }
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* ✅ Mobile Section */}
          <div className="flex space-x-2 items-center md:hidden relative">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md shadow-md text-gray-800 dark:text-gray-100 text-sm border border-gray-300 dark:border-gray-600"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </button>

                {mobileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setMobileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={
                  location.pathname === '/login' ? activeStyle : inactiveStyle
                }
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


