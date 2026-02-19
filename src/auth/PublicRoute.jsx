import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {

  // ✅ CHANGED — use context instead of sessionStorage
  const { isAuthenticated, loading } = useAuth();

  // ✅ ADDED — wait for refresh check
  if (loading) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}
