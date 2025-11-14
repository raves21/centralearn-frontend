import SidePanel from "@/components/layout/SidePanel";
import TopPanel from "@/components/layout/TopPanel";
import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin-panel")({
  component: RouteComponent,
});

function RouteComponent() {
  useRouteRoleGuard({
    allowedRoles: [Role.ADMIN, Role.SUPERADMIN],
  });

  return (
    <div className="relative flex flex-col overflow-hidden min-h-dvh w-dvw bg-gray-bg">
      <TopPanel />
      <div className="flex flex-grow overflow-hidden size-full">
        <SidePanel />
        <div className="flex-grow overflow-auto px-7 pt-[calc(9dvh+28px)] pl-[325px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
