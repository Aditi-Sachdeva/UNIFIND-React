import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabaseClient';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/public/Home';
import ReportItem from './pages/public/ReportItem';
import ViewListings from './pages/public/ViewListings';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loginToastShown, setLoginToastShown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', session.user.id)
          .single();
        setUser({ ...session.user, role: data?.role || 'user', username: data?.username || '' });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role, username')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setUser({ ...session.user, role: data?.role || 'user', username: data?.username || '' });
          });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !loginToastShown) {
      setLoginToastShown(true);
      toast.success(`Welcome back, ${user.username || user.email.split('@')[0]}!`);
    }
    if (!user) {
      setLoginToastShown(false); // Reset toast flag on logout
    }
  }, [user, loginToastShown]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/signup" element={loading ? null : user ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/login" element={loading ? null : user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requireAdmin={true}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute user={user}>
              <ReportItem user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings"
          element={
            <ProtectedRoute user={user}>
              <ViewListings user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import AdminLayout from "./components/admin/AdminLayout";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminReports from "./pages/admin/AdminReports";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/dashboard"
//           element={
//             <AdminLayout>
//               <AdminDashboard />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/manage-reports"
//           element={
//             <AdminLayout>
//               <AdminReports />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="*"
//           element={
//             <AdminLayout>
//               <AdminDashboard />
//             </AdminLayout>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;





