import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  EssayItem,
} from "@/domains/assessmentMaterials/types";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";
import { useDebounceUpdateAnswer } from "@/utils/hooks/useDebounceUpdateAttemptAnswer";
import { useAnswerContent } from "@/utils/hooks/useAnswerContent";
import { cn } from "@/lib/utils";
import { useIsUnanswered } from "@/utils/hooks/useIsUnanswered";

type Props = {
  attemptId: string;
  questionnaireItem: AssessmentMaterial & { materialable: EssayItem };
};

export default function EssayItemBlock({
  questionnaireItem,
  attemptId,
}: Props) {
  const setAnswer = useAttemptAnswersStore((state) => state.setAnswer);

  const answerContent = useAnswerContent({
    assessmentMaterialId: questionnaireItem.id,
  });

  const isUnanswered = useIsUnanswered({ itemId: questionnaireItem.id });

  useDebounceUpdateAnswer({
    assessmentMaterialId: questionnaireItem.id,
    materialType: "essay_item",
    attemptId,
  });

  return (
    <div
      id={questionnaireItem.id}
      className={cn("flex flex-col gap-7 p-6 rounded-md bg-white", {
        "border border-red-500": isUnanswered,
      })}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Essay</p>
        <div className="font-semibold text-mainaccent bordber border-mainaccent rounded-md px-3 py-2">
          {questionnaireItem.pointWorth} point
          {questionnaireItem.pointWorth > 1 && <span>s</span>}
        </div>
      </div>
      <MaterialQuestionDisplay
        question={questionnaireItem.question}
        questionNumber={questionnaireItem.order}
      />
      <div className="grid grid-cols-2 gap-6 w-fit rounded-md p-5 bg-white border border-gray-200">
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Minimum Words:</p>
          {questionnaireItem.materialable.minWordCount ? (
            <p className="text-mainaccent">
              {questionnaireItem.materialable.minWordCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Maximum Words:</p>
          {questionnaireItem.materialable.maxWordCount ? (
            <p className="text-mainaccent">
              {questionnaireItem.materialable.maxWordCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Minimum Characters:</p>
          {questionnaireItem.materialable.minCharacterCount ? (
            <p className="text-mainaccent">
              {questionnaireItem.materialable.minCharacterCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Maximum Characters:</p>
          {questionnaireItem.materialable.maxCharacterCount ? (
            <p className="text-mainaccent">
              {questionnaireItem.materialable.maxCharacterCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
      </div>
      <TiptapEditor
        content={answerContent ?? ""}
        onChange={(content) =>
          setAnswer(questionnaireItem.id, {
            assessmentMaterialId: questionnaireItem.id,
            content,
            materialType: "essay_item",
          })
        }
      />
    </div>
  );
}
