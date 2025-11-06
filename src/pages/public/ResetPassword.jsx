
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionLoaded(true);
      }
    });

    // Fallback: try to get session manually
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        console.error('Session error:', error?.message);
        toast.error('Invalid or expired reset link. Please try again.');
        return;
      }
      setSessionLoaded(true);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionLoaded) {
        toast.error('Session could not be loaded. Please retry the reset link.');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [sessionLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error('Password update error:', error.message);
      return toast.error(error.message);
    }

    toast.success('Password updated successfully!');
    navigate('/login');
  };

  if (!sessionLoaded) {
    return (
      <div className="flex justify-center  items-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white ">
        <p className="text-lg text-center">Loading reset session...</p>
      </div>
    );
  }
return (
  <div className="flex justify-center items-center  bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 min-h-[calc(100vh-64px)]">
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 px-5 py-20 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
        Reset Password
      </h2>

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 dark:bg-blue-500 py-3 rounded-md text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        Update Password
      </button>
    </form>
  </div>
);
}
export default ResetPassword;

