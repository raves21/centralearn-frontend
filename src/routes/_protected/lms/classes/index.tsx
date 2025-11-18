import AdminLmsClasses from "@/domains/admins/lms/AdminLmsClasses";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/lms/classes/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminLmsClasses />;
}
