import { Loader2 } from "lucide-react";
import { usePendingOverlayStore } from "./usePendingOverlayStore";
import { useShallow } from "zustand/react/shallow";

export default function PendingOverlay() {
  const [isPending, pendingLabel] = usePendingOverlayStore(
    useShallow((state) => [state.isPending, state.pendingLabel])
  );

  if (isPending) {
    return (
      <div className="flex fixed top-0 left-0 w-dvw h-dvh items-center justify-center gap-6 z-[99999999] bg-gray-800/40">
        <p className="text-2xl text-white">{pendingLabel}</p>
        <Loader2 className="size-10 animate-spin stroke-white" />
      </div>
    );
  }
  return null;
}
