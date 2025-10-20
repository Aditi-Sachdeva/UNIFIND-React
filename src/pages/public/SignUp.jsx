import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import supabase from '../../supabaseClient';

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      return setError('All fields are required');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) return setError(signUpError.message);

    const userId = data?.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: userId, username }]);

      if (profileError) return setError(profileError.message);
    }

    navigate('/');
  };

  return (
    <div className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col min-h-screen transition-colors duration-300">
      <Navbar />

      <div className="flex flex-grow justify-center items-center p-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md border border-blue-600 dark:border-blue-500 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Signup</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 text-white"
            >
              Signup
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;