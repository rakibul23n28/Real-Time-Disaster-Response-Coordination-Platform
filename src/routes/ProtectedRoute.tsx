import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { type UserRole } from "../data/mockUsers";

interface ProtectedRouteProps {
  role: UserRole;
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
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
