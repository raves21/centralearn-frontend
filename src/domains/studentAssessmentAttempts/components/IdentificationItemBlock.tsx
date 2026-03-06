import { Input } from "@/components/ui/input";
import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  IdentificationItem,
} from "@/domains/assessmentMaterials/types";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useMemo } from "react";
import { useUpdateAttemptAnswer } from "../api/mutations";

type Props = {
  questionnaireItem: AssessmentMaterial & { materialable: IdentificationItem };
  attemptId: string;
};

export default function IdentificationItemBlock({
  questionnaireItem,
  attemptId,
}: Props) {
  const [answers, setAnswerContent] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.setAnswerContent]),
  );

  const answerContent = useMemo<string | null | undefined>(() => {
    const answer = answers.find(
      (ans) => ans.assessmentMaterialId === questionnaireItem.id,
    );
    return answer?.content;
  }, [answers, questionnaireItem]);

  const { mutate: updateAttemptAnswer } = useUpdateAttemptAnswer();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (answerContent) {
        updateAttemptAnswer({
          attemptId,
          answer: {
            content: answerContent,
            assessmentMaterialId: questionnaireItem.id,
            materialType: "identification_item",
          },
        });
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [answerContent]);

  return (
    <div
      id={questionnaireItem.id}
      className="flex flex-col gap-7 p-6 rounded-md bg-white"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Identification</p>
        <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
          {questionnaireItem.pointWorth} point
          {questionnaireItem.pointWorth > 1 && <span>s</span>}
        </div>
      </div>
      <MaterialQuestionDisplay
        question={questionnaireItem.question}
        questionNumber={questionnaireItem.order}
      />
      <div className="flex flex-col gap-5 w-[400px]">
        <p className="text-[15px] font-medium">Answer</p>
        <Input
          value={answerContent ?? ""}
          onChange={(e) =>
            setAnswerContent(questionnaireItem.id, e.currentTarget.value)
          }
        />
      </div>
    </div>
  );
}
