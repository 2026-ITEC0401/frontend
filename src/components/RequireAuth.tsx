import { Navigate } from "react-router-dom";
import { getAccessToken, getHouseholdId } from "@/lib/auth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!getAccessToken() || !getHouseholdId()) {
    return <Navigate to="/start" replace />;
  }
  return <>{children}</>;
}
