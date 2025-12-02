import Providers from "@/components/layout/Providers";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}
