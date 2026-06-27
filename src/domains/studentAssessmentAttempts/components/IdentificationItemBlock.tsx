import { Input } from "@/components/ui/input";
import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  IdentificationItem,
} from "@/domains/assessmentMaterials/types";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";
import { useDebounceUpdateAnswer } from "@/utils/hooks/useDebounceUpdateAttemptAnswer";
import { useAnswerContent } from "@/utils/hooks/useAnswerContent";
import { useIsUnanswered } from "@/utils/hooks/useIsUnanswered";
import { cn } from "@/lib/utils";
import type { SubmissionSummaryItem } from "../types";
import PointsEarned from "./PointsEarned";

type Props = {
  questionnaireItem: AssessmentMaterial & { material: IdentificationItem };
  attemptId: string;
  isReadOnly: boolean;
  submissionSummaryItem?: SubmissionSummaryItem;
};

export default function IdentificationItemBlock({
  questionnaireItem,
  attemptId,
  isReadOnly,
  submissionSummaryItem,
}: Props) {
  const setAnswer = useAttemptAnswersStore((state) => state.setAnswer);

  const answerContent = useAnswerContent({
    assessmentMaterialId: questionnaireItem.id,
  });

  const isUnanswered = useIsUnanswered({
    itemId: questionnaireItem.id,
    answerContent,
  });

  useDebounceUpdateAnswer({
    assessmentMaterialId: questionnaireItem.id,
    attemptId,
    materialType: "identification_item",
    enabled: isReadOnly === false,
  });

  return (
    <div
      id={questionnaireItem.id}
      className={cn("flex flex-col gap-7 p-6 rounded-md bg-white", {
        "border border-red-500": isUnanswered,
      })}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Identification</p>
        {isReadOnly && submissionSummaryItem ? (
          <PointsEarned
            itemPointWorth={questionnaireItem.pointWorth}
            pointsEarned={submissionSummaryItem.points_earned}
          />
        ) : (
          <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
            {questionnaireItem.pointWorth} point
            {questionnaireItem.pointWorth > 1 && <span>s</span>}
          </div>
        )}
      </div>
      <MaterialQuestionDisplay
        question={questionnaireItem.question}
        questionNumber={questionnaireItem.order}
      />
      <div className="flex flex-col gap-5 w-[400px]">
        <p className="text-[15px] font-medium">Answer</p>
        <Input
          disabled={isReadOnly}
          value={answerContent ?? ""}
          onChange={(e) =>
            setAnswer(questionnaireItem.id, {
              assessmentMaterialId: questionnaireItem.id,
              content: e.currentTarget.value,
              materialType: "identification_item",
            })
          }
        />
      </div>
    </div>
  );
}
