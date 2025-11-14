import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin-panel/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="size-full bg-yellow-300 grid place-items-center">
      dashboard
    </div>
  );
}
