import { useAttemptAnswersStore } from "@/domains/studentAssessmentAttempts/stores/useAttemptAnswersStore";
import { useMemo } from "react";

type Args = {
  assessmentMaterialId: string;
};

export function useAnswerContent({ assessmentMaterialId }: Args) {
  const answers = useAttemptAnswersStore((state) => state.answers);

  const answerContent = useMemo<string | null | undefined>(() => {
    const answer = answers.find(
      (ans) => ans.assessmentMaterialId === assessmentMaterialId,
    );
    return answer?.content;
  }, [answers, assessmentMaterialId]);

  return answerContent;
}
