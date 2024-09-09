import { useLocalStorageContext } from "../Context/LocalStorageContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { access, refresh, isLoading } = useLocalStorageContext();
  if (isLoading) return null;
  return access && refresh ? <Outlet /> : <Navigate to="/login" replace />;
};
