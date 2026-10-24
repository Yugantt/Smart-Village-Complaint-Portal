import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin" || user.role === "superadmin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;