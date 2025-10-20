import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/public/Home";
import ReportItem from "./pages/public/ReportItem";
import ViewListings from "./pages/public/ViewListings";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings"
          element={
            <ProtectedRoute>
              <ViewListings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;