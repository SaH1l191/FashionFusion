import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, authUser }) => {
  return authUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;