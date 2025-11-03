import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/students/$studentId/classes/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { studentId } = Route.useParams();
  return <div>Hello "/_protected/students/$studentId/classes/"!</div>;
}
