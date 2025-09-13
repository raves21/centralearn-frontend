import { useEffect } from "react";
import { usePendingOverlayStore } from "./usePendingOverlayStore";
import { useShallow } from "zustand/react/shallow";

type Props = {
  isPending: boolean;
  pendingLabel?: string;
};

export function usePendingOverlay({ isPending, pendingLabel }: Props) {
  const [setIsPending, setPendingLabel] = usePendingOverlayStore(
    useShallow((state) => [state.setIsPending, state.setPendingLabel])
  );

  useEffect(() => {
    setIsPending(isPending);
    setPendingLabel(pendingLabel);
  }, [isPending, pendingLabel]);
}
