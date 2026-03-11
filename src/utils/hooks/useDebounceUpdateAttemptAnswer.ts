import { useUpdateAttemptAnswer } from "@/domains/studentAssessmentAttempts/api/mutations";
import { useAttemptAnswersStore } from "@/domains/studentAssessmentAttempts/stores/useAttemptAnswersStore";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { getHtmlStringText } from "../sharedFunctions";

type Args = {
  materialType: "option_based_item" | "essay_item" | "identification_item";
  assessmentMaterialId: string;
  attemptId: string;
};

export function useDebounceUpdateAnswer({
  assessmentMaterialId,
  materialType,
  attemptId,
}: Args) {
  const [answers, isAnswersHydrated] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.isAnswersHydrated]),
  );

  const answer = answers.find(
    (ans) => ans.assessmentMaterialId === assessmentMaterialId,
  );

  const answerContent = answer?.content;

  const { mutate: updateAttemptAnswer } = useUpdateAttemptAnswer();

  // Tracks whether the next effect run is the initial hydration event.
  // We skip the API call on that first fire because it was triggered by
  // Questionnaire populating the store — not by a real student edit.
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!isAnswersHydrated) return;

    // Skip the very first time the effect fires after hydration.
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (materialType === "option_based_item") {
        if (answerContent) {
          updateAttemptAnswer({
            attemptId,
            answer: {
              content: answerContent,
              assessmentMaterialId,
              materialType,
            },
          });
        }
      }

      if (
        materialType === "identification_item" ||
        materialType === "essay_item"
      ) {
        updateAttemptAnswer({
          attemptId,
          answer: {
            content: getHtmlStringText(answerContent) || "",
            assessmentMaterialId,
            materialType,
          },
        });
      }
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [answerContent, isAnswersHydrated]);
}
