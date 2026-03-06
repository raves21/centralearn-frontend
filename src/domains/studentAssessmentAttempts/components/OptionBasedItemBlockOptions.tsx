import RenderTiptapHTML from "@/components/shared/tiptap/RenderTiptapHTML";
import { cn } from "@/lib/utils";
import type { OptionBasedItemOption } from "@/domains/assessmentMaterials/types";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useMemo } from "react";
import { useUpdateAttemptAnswer } from "../api/mutations";

type Props = {
  assessmentMaterialId: string;
  option: OptionBasedItemOption;
  index: number;
  isOptionsAlphabetical: boolean;
  attemptId: string;
};

export default function OptionBasedItemBlockOptions({
  option,
  index,
  isOptionsAlphabetical,
  assessmentMaterialId,
  attemptId,
}: Props) {
  const alphabetLabel = String.fromCharCode(65 + index);

  const [answers, setAnswerContent] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.setAnswerContent]),
  );

  const answerContent = useMemo<string | null | undefined>(() => {
    const answer = answers.find(
      (ans) => ans.assessmentMaterialId === assessmentMaterialId,
    );
    return answer?.content;
  }, [answers, assessmentMaterialId]);

  const { mutate: updateAttemptAnswer } = useUpdateAttemptAnswer();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (answerContent) {
        updateAttemptAnswer({
          attemptId,
          answer: {
            content: answerContent,
            assessmentMaterialId,
            materialType: "option_based_item",
          },
        });
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [answerContent]);

  return (
    <button
      onClick={() => setAnswerContent(assessmentMaterialId, option.id)}
      className="flex items-center gap-5 text-start"
    >
      <div
        className={cn(
          "flex items-center gap-5 bg-white rounded-md p-4 w-full border-gray-200 border",
          {
            "bg-mainaccent text-white":
              answerContent && answerContent === option.id,
          },
        )}
      >
        {isOptionsAlphabetical && (
          <p className="font-medium">{alphabetLabel}.</p>
        )}
        {option.optionFile && (
          <div className="max-w-fit border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={option.optionFile.url}
              alt={option.optionFile.name}
              className="object-contain max-w-full max-h-[300px]"
            />
          </div>
        )}
        {option.optionText && (
          <RenderTiptapHTML
            content={option.optionText}
            className="w-full bg-transparent shadow-none p-0"
          />
        )}
      </div>
    </button>
  );
}
