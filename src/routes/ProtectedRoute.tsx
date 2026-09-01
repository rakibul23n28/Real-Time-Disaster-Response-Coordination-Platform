import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { type UserRole } from "../data/mockUsers";

interface ProtectedRouteProps {
  role: UserRole;
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== role) {
    const redirectMap: Record<UserRole, string> = {
      citizen: "/citizen",
      volunteer: "/volunteer",
      admin: "/admin",
    };
    return <Navigate to={redirectMap[user!.role]} replace />;
  }

  return <Outlet />;
}
