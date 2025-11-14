import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/lms/dashboard/"!</div>;
}
