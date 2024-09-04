import { useLocalStorageContext } from "../Context/LocalStorageContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { access, isLoading } = useLocalStorageContext();
  if (isLoading) return null;
  return access ? <Outlet /> : <Navigate to="/login" replace />;
};
