import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PageLoader } from "../ui/LoadingSpinner";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // After auth settles (loading=false) with a user but no profile yet,
  // wait up to 3 s before making any redirect decision. This handles the
  // edge case where the safety timer forced loading=false while a second
  // auth event is still in flight bringing the real profile data.
  const [profileGraceExpired, setProfileGraceExpired] = useState(false);

  useEffect(() => {
    if (!loading && user && !profile) {
      const t = setTimeout(() => setProfileGraceExpired(true), 3000);
      return () => clearTimeout(t);
    }
    if (profile) setProfileGraceExpired(false);
  }, [loading, user, profile]);

  // 1. Auth still resolving — wait
  if (loading) return <PageLoader />;

  // 2. Not authenticated — send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but profile not yet loaded — wait (with 3 s cap)
  if (!profile && !profileGraceExpired) return <PageLoader />;

  // 4. Profile loaded (or grace expired) — enforce role for admin routes
  if (adminOnly && profile?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
