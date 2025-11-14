import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useCurrentUser } from "../../domains/auth/api/queries";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
});

function RouteComponent() {
  const { status: getCurrentUserStatus } = useCurrentUser();

  if (getCurrentUserStatus === "pending") {
    return (
      <div className="flex items-center justify-center gap-6 font-semibold h-dvh bg-gray-bg text-mainaccent">
        <p className="text-4xl font-semibold">CentraLearn</p>
        <Loader className="size-16 animate-spin stroke-mainaccent" />
      </div>
    );
  }

  if (getCurrentUserStatus === "error") {
    return <Navigate to="/login" />;
  }

  if (getCurrentUserStatus === "success") {
    return <Outlet />;
  }
}
