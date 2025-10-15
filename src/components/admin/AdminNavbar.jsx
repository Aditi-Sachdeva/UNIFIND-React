import ThemeToggle from "../common/ThemeToggle";

export default function AdminNavbar({ username = "user"}) {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <a href="/index.html" className="font-bold text-3xl text-blue-600">
            UNIFIND
          </a>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            
            {/* Dark Mode Toggle */}
            <ThemeToggle/>

            {/* User Info */}
            <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md shadow-md text-gray-800 dark:text-gray-100 text-sm border border-gray-300 dark:border-gray-600">
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
              <span>{username}</span>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}