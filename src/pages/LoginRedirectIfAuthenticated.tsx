import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Login from "./Login";

const LoginRedirectIfAuthenticated = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Login />;
};

export default LoginRedirectIfAuthenticated;
