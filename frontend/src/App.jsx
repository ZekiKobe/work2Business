import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Landing from "./pages/LandingPage/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPaasword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Recommendations from "./pages/recommendations/Recommendation";
import Plans from "./pages/plans/plans";
import FavoritePlans from "./pages/plans/FavoritePlans";
import PlanDetails from "./pages/plans/PlanDetails";
import Profile from "./pages/profile/profile";
import Settings from "./pages/settings/Settings";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminLayout from "./layouts/AdminLayout";
import HowItWorksPage from "./pages/public/HowItWorksPage";
import FeaturesPage from "./pages/public/FeaturesPage";
import PricingPage from "./pages/public/PricingPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/public/TermsOfServicePage";
import SecurityPage from "./pages/public/SecurityPage";
import ContactPage from "./pages/public/ContactPage";
import Checkout from "./pages/checkout/Checkout";
import Billing from "./pages/billing/Billing";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080d1a]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading Work2Business...</p>
      </div>
    </div>
  );
}

function EmployeeRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingScreen />;
  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        <Route path="/dashboard" element={<EmployeeRoute><Dashboard /></EmployeeRoute>} />
        <Route path="/recommendations" element={<EmployeeRoute><Recommendations /></EmployeeRoute>} />
        <Route path="/plans" element={<EmployeeRoute><Plans /></EmployeeRoute>} />
        <Route path="/favorites" element={<EmployeeRoute><FavoritePlans /></EmployeeRoute>} />
        <Route path="/plans/:id" element={<EmployeeRoute><PlanDetails /></EmployeeRoute>} />
        <Route path="/profile" element={<EmployeeRoute><Profile /></EmployeeRoute>} />
        <Route path="/settings" element={<EmployeeRoute><Settings /></EmployeeRoute>} />
        <Route path="/checkout" element={<EmployeeRoute><Checkout /></EmployeeRoute>} />
        <Route path="/billing" element={<EmployeeRoute><Billing /></EmployeeRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminPanel />} />
          <Route path="ideas" element={<AdminPanel />} />
          <Route path="users" element={<AdminPanel />} />
          <Route path="plans" element={<AdminPanel />} />
          <Route path="payments" element={<AdminPanel />} />
          <Route path="invoices" element={<AdminPanel />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
