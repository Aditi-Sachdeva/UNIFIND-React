import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import supabase from '../../supabaseClient';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminNavbar({ username = "Admin" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed. Please try again.');
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="font-bold text-3xl text-blue-600">
            UNIFIND
          </Link>

          {/* Right Side */}
          <div className="hidden md:flex space-x-4 items-center">
            <ThemeToggle />

            {/* User Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md shadow-md text-gray-800 dark:text-gray-100 text-sm border border-gray-300 dark:border-gray-600"
              >
                <div className="w-7 h-7 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span>{username}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Logout */}
          <div className="flex space-x-2 items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 border-2 border-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-700 hover:border-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}