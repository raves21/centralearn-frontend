import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  EssayItem,
} from "@/domains/assessmentMaterials/types";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

type Props = {
  questionnaireItem: AssessmentMaterial & { materialable: EssayItem };
};

export default function EssayItemBlock({ questionnaireItem }: Props) {
  const [answers, setAnswerContent] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.setAnswerContent]),
  );

  const answerContent = useMemo<string | null | undefined>(() => {
    const answer = answers.find(
      (ans) => ans.materialId === questionnaireItem.materialId,
    );
    return answer?.content;
  }, [answers]);

  return (
    <div
      id={questionnaireItem.materialId}
      className="flex flex-col gap-7 p-6 rounded-md bg-white"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Essay</p>
        <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
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
          setAnswerContent(questionnaireItem.materialId, content)
        }
      />
    </div>
  );
}
