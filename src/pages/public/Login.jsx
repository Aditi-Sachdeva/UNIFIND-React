import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import supabase from "../../supabaseClient";
import { toast } from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = form;

    if (!email || !password) {
      return toast.error('Both fields are required');
    }

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return toast.error(loginError.message);
    }

    toast.success('Login successful!');
    navigate('/');
  };

  return (
    <div className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col min-h-screen transition-colors duration-300">

      <div className="flex flex-grow justify-center items-center p-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-300 dark:border-blue-500 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
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