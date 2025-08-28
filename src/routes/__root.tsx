import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex items-center gap-4">
        <p>Home</p>
        <p>Test</p>
      </div>
      <Outlet />
    </>
  );
}
