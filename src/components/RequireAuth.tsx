import { Navigate } from "react-router-dom";
import { getAccessToken } from "@/lib/auth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!getAccessToken()) {
    return <Navigate to="/start" replace />;
  }
  return <>{children}</>;
}
