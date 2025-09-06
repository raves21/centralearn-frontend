import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useCurrentUser } from "../../domains/auth/api/queries";

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
    return <Navigate to="/dashboard" />;
  }

  if (getCurrentUserStatus === "error") {
    return <Outlet />;
  }
}
