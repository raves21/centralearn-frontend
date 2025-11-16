import SidePanel from "@/components/layout/SidePanel";
import TopPanel from "@/components/layout/TopPanel";
import { useCurrentUser } from "@/domains/auth/api/queries";
import { Role, type NavigationButton } from "@/utils/sharedTypes";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { ChartColumnBig, Clipboard, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/_protected/lms")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;

  const adminLmsRoutes: NavigationButton[] = [
    {
      name: "Classes",
      linkProps: {
        to: "/lms/classes",
      },
      icon: <Clipboard key={crypto.randomUUID()} className="size-6" />,
    },
  ];

  const instructorLmsRoutes: NavigationButton[] = [
    {
      name: "Dashboard",
      linkProps: {
        to: "/lms/dashboard",
      },
      icon: <LayoutGrid key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Classes",
      linkProps: {
        to: "/lms/classes",
      },
      icon: <Clipboard key={crypto.randomUUID()} className="size-6" />,
    },
  ];

  const studentLmsRoutes: NavigationButton[] = [
    {
      name: "Dashboard",
      linkProps: {
        to: "/lms/dashboard",
      },
      icon: <LayoutGrid key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Classes",
      linkProps: {
        to: "/lms/classes",
      },
      icon: <Clipboard key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Grades",
      linkProps: {
        to: "/lms/grades",
      },
      icon: <ChartColumnBig key={crypto.randomUUID()} className="size-6" />,
    },
  ];

  if ([Role.ADMIN, Role.SUPERADMIN].includes(currentUser.roles[0])) {
    return (
      <div className="relative flex flex-col overflow-hidden min-h-dvh w-dvw bg-gray-bg">
        <TopPanel type="lms" />
        <div className="flex flex-grow overflow-hidden size-full">
          <SidePanel routes={adminLmsRoutes} />
          <div className="flex-grow overflow-auto px-7 pt-[calc(9dvh+28px)] pl-[325px]">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.roles[0] === Role.INSTRUCTOR) {
    return (
      <div className="relative flex flex-col overflow-hidden min-h-dvh w-dvw bg-gray-bg">
        <TopPanel type="lms" />
        <div className="flex flex-grow overflow-hidden size-full">
          <SidePanel routes={instructorLmsRoutes} />
          <div className="flex-grow overflow-auto px-7 pt-[calc(9dvh+28px)] pl-[325px]">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.roles[0] === Role.STUDENT) {
    return (
      <div className="relative flex flex-col overflow-hidden min-h-dvh w-dvw bg-gray-bg">
        <TopPanel type="lms" />
        <div className="flex flex-grow overflow-hidden size-full">
          <SidePanel routes={studentLmsRoutes} />
          <div className="flex-grow overflow-auto px-7 pt-[calc(9dvh+28px)] pl-[325px]">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
}
