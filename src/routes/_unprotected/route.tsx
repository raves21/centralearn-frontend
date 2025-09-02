import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useCurrentUser } from "../../services/auth/api/queries";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/_unprotected")({
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

  if (getCurrentUserStatus === "success") {
    return <Navigate to="/home" />;
  }

  if (getCurrentUserStatus === "error") {
    return <Outlet />;
  }
}
