import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const CustomerProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admins to admin dashboard
  if (user?.role === 'HOTEL_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default CustomerProtectedRoute;