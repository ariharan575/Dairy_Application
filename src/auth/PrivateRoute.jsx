import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {

  // ✅ CHANGED — use context instead of sessionStorage
  // WHY: sessionStorage does not update reactively
  const { isAuthenticated, loading } = useAuth();

  // ✅ ADDED — wait until refresh check finishes
  // WHY: prevent flicker redirect before refresh completes
  if (loading) {
    return null; 
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
