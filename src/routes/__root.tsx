import { createRootRoute, Outlet } from "@tanstack/react-router";
import Providers from "../components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";
import PendingOverlay from "@/components/shared/globals/pendingOverlay/PendingOverlay";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Providers>
      <div className="text-sm font-poppins">
        <Toaster theme="light" richColors />
        <PendingOverlay />
        <Outlet />
      </div>
    </Providers>
  );
}
