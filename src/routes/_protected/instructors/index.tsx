import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/instructors/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="size-full">Hello "/_protected/instructors/"!</div>;
}
