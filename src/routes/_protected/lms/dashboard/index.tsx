import RoleBasedComponent from "@/components/shared/RoleBasedComponent";
import InstructorLmsDashboard from "@/domains/instructors/components/lms/InstructorLmsDashboard";
import StudentLmsDashboard from "@/domains/students/components/lms/StudentLmsDashboard";
import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  useRouteRoleGuard({
    allowedRoles: [Role.STUDENT, Role.INSTRUCTOR],
  });

  return (
    <RoleBasedComponent
      instructorComponent={<InstructorLmsDashboard />}
      studentComponent={<StudentLmsDashboard />}
    />
  );
}
