import { useState, useEffect } from "react";
import { useGeneralStore } from "../stores/useGeneralStore";

export function useSetTopPanelPointerEventsWhenDragging() {
  const [isDragging, setIsDragging] = useState(false);

  const setTopPanelPointerEventsNone = useGeneralStore(
    (state) => state.setTopPanelPointerEventsNone
  );

  useEffect(() => {
    if (isDragging) {
      setTopPanelPointerEventsNone(true);
    } else {
      setTopPanelPointerEventsNone(false);
    }
  }, [isDragging]);

  return {
    isDragging,
    setIsDragging,
  };
}
