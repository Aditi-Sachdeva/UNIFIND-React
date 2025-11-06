// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../../components/layout/Navbar';
// import supabase from '../../supabaseClient';
// import { toast } from 'react-hot-toast';

// const Signup = () => {
//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const updatedForm = { ...form, [e.target.name]: e.target.value };
//     console.log('Form updated:', updatedForm);
//     setForm(updatedForm);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Form submitted with:', form);

//     const { username, email, password, confirmPassword } = form;

//     if (!username || !email || !password || !confirmPassword) {
//       console.warn('Validation failed: Missing fields');
//       return toast.error('All fields are required');
//     }
//     if (password !== confirmPassword) {
//       console.warn('Validation failed: Passwords do not match');
//       return toast.error('Passwords do not match');
//     }

//     console.log('Calling Supabase auth.signUp...');
//     const { data, error: signUpError } = await supabase.auth.signUp({
//       email,
//       password,
//     });
//     console.log('Supabase signup response:', { data, signUpError });

//     if (signUpError) {
//       const msg = signUpError.message.toLowerCase();
//       if (msg.includes('already registered')) {
//         console.warn('Signup error: Email already registered');
//         return toast.error('This email is already registered. Please log in instead.');
//       }
//       console.error('Signup error:', signUpError.message);
//       return toast.error(signUpError.message);
//     }

//     const userId = data?.user?.id;
//     console.log('New user ID:', userId);

//     if (userId) {
//       console.log('Inserting profile into Supabase...');
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .insert([{ id: userId, username }]);

//       console.log('Profile insert result:', { profileError });

//       if (profileError) {
//         const msg = profileError.message.toLowerCase();
//         if (msg.includes('foreign key constraint') && msg.includes('profiles_id_fkey')) {
//           console.warn('Profile insert error: Foreign key constraint');
//           return toast.error('This email is already registered. Please log in instead.');
//         }
//         console.error('Profile insert error:', profileError.message);
//         return toast.error(profileError.message);
//       }
//     }

//     console.log('Signup successful. Navigating to login...');
//     toast.success('Signup successful! Please check your email to confirm.');
//     setTimeout(() => navigate('/login'), 3000);
//   };

//   return (
//     <div className="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col  transition-colors duration-300 min-h-[calc(100vh-64px)]">
//       <div className="flex flex-grow justify-center items-center p-4 dark:bg-gray-900">
//         <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300 dark:border-blue-500 transition-colors duration-300">
//           <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Signup</h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Username */}
//             <div>
//               <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Username</label>
//               <input
//                 type="text"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
//               />
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Confirm Password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
//               />
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 dark:bg-blue-500 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 text-white"
//             >
//               Signup
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-4">
//             Already have an account?{' '}
//             <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
//               Login here
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import supabase from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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

    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      console.warn('Validation failed: Missing fields');
      return toast.error('All fields are required');
    }
    if (password !== confirmPassword) {
      console.warn('Validation failed: Passwords do not match');
      return toast.error('Passwords do not match');
    }

    console.log('Calling Supabase auth.signUp...');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log('Supabase signup response:', { data, signUpError });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes('already registered')) {
        console.warn('Signup error: Email already registered');
        return toast.error('This email is already registered. Please log in instead.');
      }
      console.error('Signup error:', signUpError.message);
      return toast.error(signUpError.message);
    }

    const userId = data?.user?.id;
    console.log('New user ID:', userId);

    if (userId) {
      console.log('Inserting profile into Supabase...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: userId, username }]);

      console.log('Profile insert result:', { profileError });

      if (profileError) {
        const msg = profileError.message.toLowerCase();
        if (msg.includes('foreign key constraint') && msg.includes('profiles_id_fkey')) {
          console.warn('Profile insert error: Foreign key constraint');
          return toast.error('This email is already registered. Please log in instead.');
        }
        console.error('Profile insert error:', profileError.message);
        return toast.error(profileError.message);
      }
    }

    console.log('Signup successful. Navigating to login...');
    toast.success('Signup successful! Please check your email to confirm.');
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div className="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col transition-colors duration-300 min-h-[calc(100vh-64px)]">
      <div className="flex grow justify-center items-center p-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300 dark:border-blue-500 transition-colors duration-300">
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

            <div className="relative">
  <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Password</label>
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    value={form.password}
    onChange={handleChange}
    className="w-full p-2 pr-10 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
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

            {/* Confirm Password */}
  <div className="relative">
  <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Confirm Password</label>
  <input
    type={showPassword ? 'text' : 'password'}
    name="confirmPassword"
    value={form.confirmPassword}
    onChange={handleChange}
    className="w-full p-2 pr-10 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
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

