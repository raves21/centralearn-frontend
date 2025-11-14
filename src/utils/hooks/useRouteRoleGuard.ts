import { useEffect } from "react";
import type { Role } from "../sharedTypes";
import { useCurrentUser } from "@/domains/auth/api/queries";
import { useNavigate } from "@tanstack/react-router";

type Args = {
  allowedRoles: Role[];
};

export function useRouteRoleGuard({ allowedRoles }: Args) {
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    if (!allowedRoles.includes(currentUser.roles[0])) {
      navigate({ to: "/" });
    }
  }, [allowedRoles, currentUser]);
}
