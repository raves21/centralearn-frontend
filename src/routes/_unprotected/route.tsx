import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useCurrentUser } from "../../services/auth/api/queries";

export const Route = createFileRoute("/_unprotected")({
  component: RouteComponent,
});

function RouteComponent() {
  const { status: getCurrentUserStatus } = useCurrentUser();

  if (getCurrentUserStatus === "pending") {
    return (
      <div className="h-dvh grid place-items-center text-cta font-semibold">
        <p className="text-4xl">Loading...</p>
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
