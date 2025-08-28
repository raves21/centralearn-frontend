import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="">
      <h3 className="text-red-500 text-5xl">heloworld</h3>
      <Button className="bg-red-500 px-24">Click22z</Button>
    </div>
  );
}
