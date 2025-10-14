import ThemeToggle from "../common/ThemeToggle"

function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="#" className="font-bold text-3xl text-blue-600">
            UNIFIND
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <a
              href="#"
              className="text-white bg-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-800 hover:border-blue-800 transition"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-900 bg-gray-200 border-2 border-gray-200 px-3 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white dark:text-white dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              Report Item
            </a>
            <a
              href="#"
              className="text-gray-900 bg-gray-200 border-2 border-gray-200 px-3 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white dark:text-white dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              View Listings
            </a>
          </div>

          {/* Right Side (Theme Toggle + Auth Buttons) */}
          <div className="hidden md:flex space-x-4 items-center">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            <a
              href="#"
              className="text-white bg-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-800 hover:border-blue-800 transition"
            >
              Login
            </a>
            <a
              href="#"
              className="text-blue-600 bg-white border-2 border-blue-600 px-3 py-1 rounded-md text-sm dark:text-white dark:bg-gray-800 dark:border-gray-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition"
            >
              Signup
            </a>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex space-x-2 items-center md:hidden">
            <ThemeToggle/>
            <a
              href="#"
              className="text-white bg-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-800 hover:border-blue-800 transition"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;