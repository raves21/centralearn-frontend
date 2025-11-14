import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/classes/")({
  component: RouteComponent,
});

function RouteComponent() {
  //temp, since admin will also have access to lms
  useRouteRoleGuard({
    allowedRoles: [Role.STUDENT, Role.INSTRUCTOR],
  });

  return <div>Hello "/_protected/lms/classes/"!</div>;
}
