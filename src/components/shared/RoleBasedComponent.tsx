import { useCurrentUser } from "@/domains/auth/api/queries";
import { Role } from "@/utils/sharedTypes";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

type Props = {
  adminComponent?: ReactNode;
  studentComponent?: ReactNode;
  instructorComponent?: ReactNode;
};

export default function RoleBasedComponent({
  adminComponent,
  instructorComponent,
  studentComponent,
}: Props) {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;
  const currentUserRole = currentUser.roles[0];

  if ([Role.ADMIN, Role.SUPERADMIN].includes(currentUserRole)) {
    return adminComponent;
  }
  if ([Role.INSTRUCTOR].includes(currentUserRole)) {
    return instructorComponent;
  }
  if ([Role.STUDENT].includes(currentUserRole)) {
    return studentComponent;
  }
}
