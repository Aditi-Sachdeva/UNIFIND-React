import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import supabase from "../../supabaseClient";
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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

    const allowedDomains = ['@gmail.com', '@chitkara.edu.in'];
    const trimmedEmail = email.trim().toLowerCase();
    const hasValidDomain = allowedDomains.some((domain) =>
      trimmedEmail.endsWith(domain)
    );

    if (!hasValidDomain) {
      return toast.error('Email must be a Gmail or Chitkara email address');
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

  // const handleForgotPassword = async () => {
  //   if (!form.email) {
  //     return toast.error('Please enter your email to reset password');
  //   }

  //   const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
  //     redirectTo: 'https://unifind-app.vercel.app/reset-password',
  //   });

  //   if (error) {
  //     return toast.error(error.message);
  //   }

  //   toast.success('Password reset email sent! Please check your inbox.');
  // };

  return (
    <div className="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col transition-colors duration-300 min-h-[calc(100vh-64px)]">
      <div className="flex grow justify-center items-start pt-24 lg:pt-34 p-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-300 dark:border-blue-500 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full p-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            <div className="relative">
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full p-2 pr-10 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-8 sm:top-9 text-gray-600 dark:text-white"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            {/* <p className="text-right text-sm mt-1">
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </a>
            </p> */}

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
