import { useAuth } from "hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export const RequiredAnonymous = ({ children }: { children: JSX.Element }) => {
  let auth = useAuth();
  let location = useLocation();

  if (auth.isLogged()) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
}