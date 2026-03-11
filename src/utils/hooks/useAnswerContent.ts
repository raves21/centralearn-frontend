import { useAttemptAnswersStore } from "@/domains/studentAssessmentAttempts/stores/useAttemptAnswersStore";
import { useEffect, useState } from "react";

type Args = {
  assessmentMaterialId: string;
};

export function useAnswerContent({ assessmentMaterialId }: Args) {
  const answers = useAttemptAnswersStore((state) => state.answers);

  const [answerContent, setAnswerContent] = useState<string | null | undefined>(
    null,
  );

  useEffect(() => {
    const answer = answers.find(
      (ans) => ans.assessmentMaterialId === assessmentMaterialId,
    );

    setAnswerContent(answer?.content);
  }, [answers, assessmentMaterialId]);

  return answerContent;
}
