import { useEffect } from "react";
import { usePendingOverlayStore } from "./usePendingOverlayStore";
import { useShallow } from "zustand/react/shallow";

type Args = {
  isPending: boolean;
  pendingLabel?: string;
};

export function usePendingOverlay({ isPending, pendingLabel }: Args) {
  const [setIsPending, setPendingLabel] = usePendingOverlayStore(
    useShallow((state) => [state.setIsPending, state.setPendingLabel])
  );

  useEffect(() => {
    setIsPending(isPending);
    setPendingLabel(pendingLabel);
  }, [isPending, pendingLabel]);
}
