import RoleBasedComponent from "@/components/shared/RoleBasedComponent";
import AdminLmsClasses from "@/domains/admins/components/lms/AdminLmsClasses";
import { useCurrentUser } from "@/domains/auth/api/queries";
import InstructorLmsClasses from "@/domains/instructors/components/lms/InstructorLmsClasses";
import StudentLmsClasses from "@/domains/students/components/lms/StudentLmsClasses";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/classes/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <RoleBasedComponent
      adminComponent={<AdminLmsClasses />}
      studentComponent={
        currentUser.studentId ? (
          <StudentLmsClasses studentId={currentUser.studentId} />
        ) : null
      }
      instructorComponent={
        currentUser.instructorId ? (
          <InstructorLmsClasses instructorId={currentUser.instructorId} />
        ) : null
      }
    />
  );
}
