import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/classes/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <p>classes</p>;
}
