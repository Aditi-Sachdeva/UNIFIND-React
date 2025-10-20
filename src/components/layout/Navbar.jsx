import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import ThemeToggle from '../common/ThemeToggle';

function Navbar() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user;
      setUser(currentUser);
      if (currentUser) fetchUsername(currentUser.id);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      if (currentUser) fetchUsername(currentUser.id);
      else setUsername('');
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchUsername = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (!error && data) setUsername(data.username);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUsername('');
    navigate('/login'); // ✅ Redirect after logout
  };

  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-3xl text-blue-600">
            UNIFIND
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              to="/"
              className="text-white bg-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-800 hover:border-blue-800 transition"
            >
              Home
            </Link>
            <Link
              to="/report"
              className="text-gray-900 bg-gray-200 border-2 border-gray-200 px-3 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white dark:text-white dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              Report Item
            </Link>
            <Link
              to="/listings"
              className="text-gray-900 bg-gray-200 border-2 border-gray-200 px-3 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white dark:text-white dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              View Listings
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex space-x-4 items-center">
            <ThemeToggle />

            {user ? (
              <>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  👤 {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-600 border-2 border-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-700 hover:border-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white bg-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-800 hover:border-blue-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-blue-600 bg-white border-2 border-blue-600 px-3 py-1 rounded-md text-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex space-x-2 items-center md:hidden">
            <ThemeToggle />
            {user ? (
              <>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  👤 {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-600 border-2 border-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-700 hover:border-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white bg-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-800 hover:border-blue-800 transition"
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