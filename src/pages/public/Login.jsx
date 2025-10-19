
import React from 'react';
import Navbar from "../../components/layout/Navbar";

const Login = () => {
  return (
    <div className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col min-h-screen transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Login Box */}
      <div className="flex flex-grow justify-center items-center p-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-300 dark:border-blue-500 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Login</h2>

          <form action="#" method="POST" className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Email</label>
              <input
                type="email"
                required
                className="w-full p-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Password</label>
              <input
                type="password"
                required
                className="w-full p-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 py-2 rounded-md text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
              Signup here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


