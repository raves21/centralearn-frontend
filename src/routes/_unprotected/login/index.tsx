import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_unprotected/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="h-dvh grid place-items-center">Login</div>;
}
