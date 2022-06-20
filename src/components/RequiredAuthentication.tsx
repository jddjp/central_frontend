import { useAuth } from "hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export const RequiredAuthentication = ({ children }: { children: JSX.Element }) => {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.isLogged()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}