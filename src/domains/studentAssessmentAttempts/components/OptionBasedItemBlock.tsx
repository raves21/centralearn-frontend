import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  OptionBasedItem,
} from "@/domains/assessmentMaterials/types";
import OptionBasedItemBlockOptions from "./OptionBasedItemBlockOptions";
import { useDebounceUpdateAnswer } from "@/utils/hooks/useDebounceUpdateAttemptAnswer";
import { useIsUnanswered } from "@/utils/hooks/useIsUnanswered";
import { cn } from "@/lib/utils";
import { useAnswerContent } from "@/utils/hooks/useAnswerContent";
import type { SubmissionSummaryItem } from "../types";
import PointsEarned from "./PointsEarned";

type Props = {
  questionnaireItem: AssessmentMaterial & { material: OptionBasedItem };
  submissionSummaryItem?: SubmissionSummaryItem;
  attemptId: string;
  isReadOnly: boolean;
};

export default function OptionBasedItemBlock({
  questionnaireItem,
  attemptId,
  isReadOnly,
  submissionSummaryItem,
}: Props) {
  useDebounceUpdateAnswer({
    assessmentMaterialId: questionnaireItem.id,
    materialType: "option_based_item",
    attemptId,
    enabled: isReadOnly === false,
  });

  const answerContent = useAnswerContent({
    assessmentMaterialId: questionnaireItem.id,
  });

  const isUnanswered = useIsUnanswered({
    itemId: questionnaireItem.id,
    answerContent,
  });

  return (
    <div
      id={questionnaireItem.id}
      className={cn("flex flex-col gap-7 p-6 rounded-md bg-white", {
        "border border-red-500": isUnanswered,
      })}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Option Based</p>
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
      <div className="flex flex-col gap-6">
        <p className="text-[15px] font-medium">Options:</p>
        <div className="flex flex-col gap-4">
          {questionnaireItem.material.options.map((option, index) => (
            <OptionBasedItemBlockOptions
              key={index}
              isReadOnly={isReadOnly}
              answerContent={answerContent}
              option={option}
              assessmentMaterialId={questionnaireItem.id}
              index={index}
              isOptionsAlphabetical={
                questionnaireItem.material.isOptionsAlphabetical
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
