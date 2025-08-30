import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useCurrentUser } from "../../services/auth/api/queries";

export const Route = createFileRoute("/_unprotected")({
  component: RouteComponent,
});

function RouteComponent() {
  const { status: getCurrentUserStatus } = useCurrentUser();

  if (getCurrentUserStatus === "pending") {
    return (
      <div className="h-dvh grid place-items-center text-violet-700 font-semibold">
        Loading...
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
