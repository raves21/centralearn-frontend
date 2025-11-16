import { useCurrentUser } from "@/domains/auth/api/queries";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;

  if ([Role.ADMIN, Role.SUPERADMIN].includes(currentUser.roles[0])) {
    return <Navigate to="/lms/classes" />;
  }

  return <Navigate to="/lms/dashboard" />;
}
