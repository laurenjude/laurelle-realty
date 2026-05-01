import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PageLoader } from "../ui/LoadingSpinner";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (adminOnly && profile?.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}
