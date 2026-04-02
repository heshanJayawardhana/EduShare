/** Legacy route: redirects to "/" (login shell). */
import { Navigate } from "react-router-dom";

export default function Index() {
  return <Navigate to="/" replace />;
}
