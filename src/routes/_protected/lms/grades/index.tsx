import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/grades/")({
  component: RouteComponent,
});

function RouteComponent() {
  useRouteRoleGuard({
    allowedRoles: [Role.STUDENT],
  });

  return <div>Hello "/_protected/lms/grades/"!</div>;
}
