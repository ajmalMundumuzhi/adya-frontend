
import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../../../services/admin/auth.service";

export default function AdminProtectedRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
