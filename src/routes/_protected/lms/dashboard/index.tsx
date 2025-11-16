import AdminLmsDashboard from "@/domains/admins/components/lms/AdminLmsDashboard";
import { useCurrentUser } from "@/domains/auth/api/queries";
import InstructorLmsDashboard from "@/domains/instructors/components/lms/InstructorLmsDashboard";
import StudentLmsDashboard from "@/domains/students/components/lms/StudentLmsDashboard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;

  const currentUserRole = currentUser.roles[0];

  if ([Role.ADMIN, Role.ADMIN].includes(currentUserRole)) {
    return <AdminLmsDashboard />;
  }

  if (currentUserRole === Role.STUDENT) {
    return <StudentLmsDashboard />;
  }

  if (currentUserRole === Role.INSTRUCTOR) {
    return <InstructorLmsDashboard />;
  }
}
