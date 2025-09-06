import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import SidePanel from "../../components/layout/SidePanel";
import TopPanel from "../../components/layout/TopPanel";
import { useCurrentUser } from "../../domains/auth/api/queries";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
});

function RouteComponent() {
  const { status: getCurrentUserStatus } = useCurrentUser();

  if (getCurrentUserStatus === "pending") {
    return (
      <div className="h-dvh flex items-center justify-center gap-6 bg-gray-bg text-mainaccent font-semibold">
        <p className="text-4xl font-semibold">CentraLearn</p>
        <Loader className="size-16 animate-spin stroke-mainaccent" />
      </div>
    );
  }

  if (getCurrentUserStatus === "error") {
    return <Navigate to="/login" />;
  }

  if (getCurrentUserStatus === "success") {
    return (
      <div className="h-dvh relative w-dvw bg-gray-bg">
        <TopPanel />
        <div className="size-full flex">
          <SidePanel />
          <div className="flex-grow pt-[calc(9dvh+28px)] px-7">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
}
