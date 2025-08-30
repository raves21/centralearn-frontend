import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useCurrentUser } from "../../services/auth/api/queries";

export const Route = createFileRoute("/_protected")({
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

  if (getCurrentUserStatus === "error") {
    return <Navigate to="/login" />;
  }

  if (getCurrentUserStatus === "success") {
    return <Outlet />;
  }
}
