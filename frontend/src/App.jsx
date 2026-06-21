import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "./context/AuthContext";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import Recommendations from "./pages/recommendations/Recommendation";
import Plans from "./pages/plans/plans";
import PlanDetails from "./pages/plans/PlanDetails";

// =========================
// 🔐 Protected Route Wrapper
// =========================
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =========================
// 🚪 Public Route Wrapper
// =========================
function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10">Loading...</div>;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ================= PRIVATE ROUTES ================= */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <PrivateRoute>
              <Recommendations />
            </PrivateRoute>
          }
        />

        <Route
          path="/plans"
          element={
            <PrivateRoute>
              <Plans />
            </PrivateRoute>
          }
        />

        <Route
          path="/plans/:id"
          element={
            <PrivateRoute>
              <PlanDetails />
            </PrivateRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </BrowserRouter>
  );
}