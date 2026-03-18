import { useAttemptAnswersStore } from "@/domains/studentAssessmentAttempts/stores/useAttemptAnswersStore";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { getHtmlStringText } from "../sharedFunctions";

type Args = {
  itemId: string;
  answerContent: string | null | undefined;
};

export function useIsUnanswered({ itemId, answerContent }: Args) {
  const [unansweredItems, setUnansweredItems] = useAttemptAnswersStore(
    useShallow((state) => [state.unansweredItems, state.setUnansweredItems]),
  );

  const [isUnanswered, setIsUnanswered] = useState<boolean>(false);

  const isFirstMount = useRef<boolean>(false);

  useEffect(() => {
    if (!isFirstMount.current) {
      isFirstMount.current = true;
      return;
    }

    if (unansweredItems.length > 0) {
      const foundUnansweredItem = unansweredItems.find(
        (unansweredItem) => unansweredItem.assessmentMaterialId === itemId,
      );

      if (foundUnansweredItem) {
        let answerContentFinal = answerContent;

        if (foundUnansweredItem.materialType === "essay_item") {
          answerContentFinal = getHtmlStringText(answerContent);
        }

        //found but already has answer content
        if (!!answerContentFinal?.trim()) {
          setIsUnanswered(false);
          setUnansweredItems(
            useAttemptAnswersStore
              .getState()
              .unansweredItems.filter(
                (item) =>
                  item.assessmentMaterialId !==
                  foundUnansweredItem.assessmentMaterialId,
              ),
          );
        } else {
          setIsUnanswered(true);
        }
      } else {
        if (!getHtmlStringText(answerContent)) {
          setIsUnanswered(true);
        }
      }
    }
  }, [unansweredItems, itemId, answerContent]);

  return isUnanswered;
}
