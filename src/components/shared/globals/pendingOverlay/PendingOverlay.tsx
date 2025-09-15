import { Loader2 } from "lucide-react";
import { usePendingOverlayStore } from "./usePendingOverlayStore";
import { useShallow } from "zustand/react/shallow";

export default function PendingOverlay() {
  const [isPending, pendingLabel] = usePendingOverlayStore(
    useShallow((state) => [state.isPending, state.pendingLabel])
  );

  if (isPending) {
    return (
      <div className="flex fixed top-0 left-0 w-dvw h-dvh items-center justify-center gap-6 z-[500] bg-gray-800/65">
        <p className="text-3xl text-white">{pendingLabel}</p>
        <Loader2 className="size-11 animate-spin stroke-white" />
      </div>
    );
  }
  return null;
}
