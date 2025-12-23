import { Loader } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className="size-full grid place-items-center">
      <Loader className="size-15 stroke-mainaccent animate-spin" />
    </div>
  );
}
