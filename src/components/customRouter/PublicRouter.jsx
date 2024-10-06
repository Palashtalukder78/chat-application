import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PublicRouter({ children }) {
  const isLoggedIn = useAuth();
  return !isLoggedIn ? children : <Navigate to="/inbox" />;
}
