import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children, requireAdmin = false }) => {
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;