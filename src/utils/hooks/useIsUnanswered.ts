import { useAttemptAnswersStore } from "@/domains/studentAssessmentAttempts/stores/useAttemptAnswersStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type Args = {
  itemId: string;
  answerContent: string | null | undefined;
};

export function useIsUnanswered({ itemId, answerContent }: Args) {
  const [unansweredItems, setUnansweredItems] = useAttemptAnswersStore(
    useShallow((state) => [state.unansweredItems, state.setUnansweredItems]),
  );

  const [isUnanswered, setIsUnanswered] = useState<boolean>(false);

  useEffect(() => {
    const foundUnansweredItem = unansweredItems.find(
      (unansweredItem) => unansweredItem.assessmentMaterialId === itemId,
    );

    if (foundUnansweredItem) {
      let answerContentFinal = answerContent;

      if (foundUnansweredItem.materialType === "essay_item") {
        const div = document.createElement("div");
        div.innerHTML = answerContent!;
        answerContentFinal = div.innerText.trim();
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
        //found but has no answer content
        setIsUnanswered(true);
      }
    } else {
      setIsUnanswered(false);
    }
  }, [unansweredItems, itemId, answerContent]);

  return isUnanswered;
}
