import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import hasPermission from "../utils/permissions";

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (!hasPermission(user, requiredPermissions))
    return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
