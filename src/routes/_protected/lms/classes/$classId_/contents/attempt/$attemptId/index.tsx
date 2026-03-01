import { useStudentAssessmentAttemptInfo } from "@/domains/studentAssessmentAttempts/api/queries";
import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId_/contents/attempt/$attemptId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  useRouteRoleGuard({
    allowedRoles: [Role.STUDENT],
  });

  const { attemptId, classId } = Route.useParams();

  const { data } = useStudentAssessmentAttemptInfo(attemptId);

  return <div>ATTEMPT ID: {attemptId}</div>;
}
