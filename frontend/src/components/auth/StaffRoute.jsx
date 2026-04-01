import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

/**
 * StaffRoute guard - allows only authenticated users with non-admin roles
 * Staff includes: operations, delivery, managers, supervisors, etc.
 * Admin users should be redirected back to admin portal
 */
export default function StaffRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-indigo-600 animate-spin">progress_activity</span>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/staff/login" replace />;
  }

  // Redirect admin users to admin portal
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Allow all other authenticated users (staff)
  return <Outlet />;
}
