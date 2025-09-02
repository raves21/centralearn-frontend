import { createRootRoute, Outlet } from "@tanstack/react-router";
import Providers from "../components/layout/Providers";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Providers>
      <div className="text-sm font-poppins">
        <Outlet />
      </div>
    </Providers>
  );
}
