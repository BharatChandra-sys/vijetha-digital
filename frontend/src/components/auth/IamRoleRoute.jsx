import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function IamRoleRoute({ allowedIamRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    const returnPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(returnPath)}`} replace />;
  }

  const iamRoles = user.iam_roles || [];
  const isAdminByLegacyRole = user.role === "admin";
  const isAllowedByIam = allowedIamRoles.some((role) => iamRoles.includes(role));

  if (!isAdminByLegacyRole && !isAllowedByIam) {
    const fallback = user.role === "staff" ? "/staff/workspace" : "/";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
