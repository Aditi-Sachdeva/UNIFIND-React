import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import supabase from './supabaseClient';
import { ThemeProvider } from "./context/ThemeContext";

// Public Pages
import Home from './pages/public/Home';
import ReportItem from './pages/public/ReportItem';
import ViewListings from './pages/public/ViewListings';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
import EditReport from './pages/public/EditReport'; 
import ResetPassword from './pages/public/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import ManageUsers from './pages/admin/ManageUsers';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loginToastShown, setLoginToastShown] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('role, username, email')
          .eq('id', session.user.id)
          .single();

        // Ensure email is synced to profiles table
        if (!data?.email && session.user.email) {
          await supabase
            .from('profiles')
            .update({ email: session.user.email })
            .eq('id', session.user.id);
        }

        setUser({
          ...session.user,
          role: data?.role || 'user',
          username: data?.username || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          supabase
            .from('profiles')
            .select('role, username, email')
            .eq('id', session.user.id)
            .single()
            .then(async ({ data }) => {
              if (!data?.email && session.user.email) {
                await supabase
                  .from('profiles')
                  .update({ email: session.user.email })
                  .eq('id', session.user.id);
              }

              setUser({
                ...session.user,
                role: data?.role || 'user',
                username: data?.username || '',
              });
            });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && !loginToastShown) {
      setLoginToastShown(true);
      toast.success(`Welcome, ${user.username || user.email.split('@')[0]}!`);
    }
    if (!user) {
      setLoginToastShown(false);
    }
  }, [user, loginToastShown]);

  return (
    <>
      <Toaster position="top-right" />
      {!location.pathname.startsWith('/admin') && <Navbar user={user} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/signup"
          element={loading ? null : user ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={loading ? null : user ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requireAdmin={true}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />
    



        <Route
          path="/admin/AdminReports"
          element={
            <ProtectedRoute user={user} requireAdmin={true}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute user={user} requireAdmin={true}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
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
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute user={user}>
              <EditReport user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}




