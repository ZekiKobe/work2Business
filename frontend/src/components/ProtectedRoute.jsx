import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // ⏳ wait until auth is ready
  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  // 🔒 block unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}