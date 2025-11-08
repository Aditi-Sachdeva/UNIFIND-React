import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import supabase from "../../supabaseClient";
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    console.log('Form updated:', updatedForm);
    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', form);

    const { email, password } = form;

    if (!email || !password) {
      console.warn('Validation failed: Missing email or password');
      return toast.error('Both fields are required');
    }

    console.log('Calling Supabase auth.signInWithPassword...');
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Supabase login response:', { data, loginError });

    if (loginError) {
      console.error('Login error:', loginError.message);
      return toast.error(loginError.message);
    }

    console.log('Login successful. Navigating to home...');
    toast.success('Login successful!');
    navigate('/');
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      return toast.error('Please enter your email to reset password');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: 'https://unifind-app.vercel.app/reset-password',

    });

    if (error) {
      console.error('Password reset error:', error.message);
      return toast.error(error.message);
    }

    toast.success('Password reset email sent! Please check your inbox.');
  };

  return (
    <div className="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col transition-colors duration-300 min-h-[calc(100vh-64px)]">
      <div className="flex grow justify-center items-start pt-24 lg:pt-34 p-4 dark:bg-gray-900">
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
            <div className="relative">
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-2 pr-10 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-8 sm:top-9 text-gray-600 dark:text-white"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <p className="text-right text-sm mt-1">
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </a>
            </p>

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

