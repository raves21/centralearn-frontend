import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/students/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="size-full bg-red-500">Hello "/_protected/students/"!</div>
  );
}
