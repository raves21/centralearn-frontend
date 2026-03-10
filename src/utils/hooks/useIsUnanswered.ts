import { useAttemptAnswersStore } from "@/domains/studentAssessmentAttempts/stores/useAttemptAnswersStore";
import { useMemo } from "react";

type Args = {
  itemId: string;
};

export function useIsUnanswered({ itemId }: Args) {
  const unansweredItemIds = useAttemptAnswersStore(
    (state) => state.unansweredItems,
  );

  const isUnanswered = useMemo<boolean>(() => {
    return !!unansweredItemIds.find(
      (unansweredItemId) => unansweredItemId === itemId,
    );
  }, [unansweredItemIds, itemId]);

  return isUnanswered;
}
