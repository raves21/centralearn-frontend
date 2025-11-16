import SidePanel from "@/components/layout/SidePanel";
import TopPanel from "@/components/layout/TopPanel";
import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role, type NavigationButton } from "@/utils/sharedTypes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutGrid,
  Calendar,
  Landmark,
  Component,
  Layers,
  UserRoundCog,
  GraduationCap,
  BriefcaseBusiness,
  Clipboard,
} from "lucide-react";

export const Route = createFileRoute("/_protected/admin-panel")({
  component: RouteComponent,
});

function RouteComponent() {
  useRouteRoleGuard({
    allowedRoles: [Role.ADMIN, Role.SUPERADMIN],
  });

  const routes: NavigationButton[] = [
    {
      name: "Dashboard",
      linkProps: {
        to: "/admin-panel/dashboard",
      },
      icon: <LayoutGrid key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Semesters",
      linkProps: {
        to: "/admin-panel/semesters",
      },
      icon: <Calendar key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Departments",
      linkProps: {
        to: "/admin-panel/departments",
      },
      icon: <Landmark key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Programs",
      linkProps: {
        to: "/admin-panel/programs",
      },
      icon: <Layers key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Courses",
      linkProps: {
        to: "/admin-panel/courses",
      },
      icon: <Layers key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Classes",
      linkProps: {
        to: "/admin-panel/classes",
      },
      icon: <Clipboard key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Sections",
      linkProps: {
        to: "/admin-panel/sections",
      },
      icon: <Component key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Admins",
      linkProps: {
        to: "/admin-panel/admins",
      },
      icon: <UserRoundCog key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Students",
      linkProps: {
        to: "/admin-panel/students",
      },
      icon: <GraduationCap key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Instructors",
      linkProps: {
        to: "/admin-panel/instructors",
      },
      icon: <BriefcaseBusiness key={crypto.randomUUID()} className="size-6" />,
    },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden min-h-dvh w-dvw bg-gray-bg">
      <TopPanel type="admin-panel" />
      <div className="flex flex-grow overflow-hidden size-full">
        <SidePanel routes={routes} />
        <div className="flex-grow overflow-auto px-7 pt-[calc(9dvh+28px)] pl-[325px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
