import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        toast.error('Invalid or expired reset link. Please try again.');
        return;
      }
      setSessionLoaded(true);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return toast.error(error.message);
    }

    toast.success('Password updated successfully!');
    navigate('/login');
  };

  if (!sessionLoaded) {
    return (
      <div className="flex justify-center items-center bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[calc(100vh-64px)]">
        <p className="text-lg text-center">Loading reset session...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300 min-h-[calc(100vh-64px)]">
      <div className="flex grow justify-center items-start pt-24 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-300 dark:border-blue-500 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full p-2 pr-10 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-600 dark:text-white"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 py-2 rounded-md text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Update Password
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-4">
            Remembered your password?{' '}
            <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Go back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
