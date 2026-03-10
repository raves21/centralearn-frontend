import { toast } from "sonner";
import { useSubmitAttempt } from "../api/mutations";
import {
  useAttemptAnswersStore,
  type Answer,
  type UnansweredItem,
} from "../stores/useAttemptAnswersStore";
import { Loader2 } from "lucide-react";
import type { AssessmentMaterial } from "@/domains/assessmentMaterials/types";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";

type Props = {
  attemptId: string;
  answers: Answer[];
  items: AssessmentMaterial[] | null;
};

export default function SubmitButton({ answers, attemptId, items }: Props) {
  const { mutateAsync: submitAttempt, status: submitAttemptStatus } =
    useSubmitAttempt();

  const setUnansweredItems = useAttemptAnswersStore(
    (state) => state.setUnansweredItems,
  );

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  //set an array refs of the unanswered items
  function checkUnansweredItemsState(
    items: AssessmentMaterial[] | null,
    answers: Answer[],
  ): UnansweredItem[] {
    if (items && items.length > 0) {
      let firstUnansweredItem: HTMLElement | null = null;
      let unansweredItems: UnansweredItem[] = [];

      items.forEach((item) => {
        const foundAnswer = answers.find(
          (ans) => ans.assessmentMaterialId === item.id,
        );

        const answerNotFound = !foundAnswer;
        const answerFoundButNoContent =
          foundAnswer && !foundAnswer.content?.trim();

        if (answerNotFound || answerFoundButNoContent) {
          firstUnansweredItem = document.getElementById(item.id);
          unansweredItems.push({
            assessmentMaterialId: item.id,
            materialType:
              item.materialType === "App\\Models\\EssayItem"
                ? "essay_item"
                : item.materialType === "App\\Models\\IdentificationItem"
                  ? "identification_item"
                  : "option_based_item",
            itemNumber: item.order,
          });
        }
      });

      if (firstUnansweredItem && unansweredItems.length !== 0) {
        setUnansweredItems(unansweredItems);
        toggleOpenDialog(
          <div className="flex flex-col gap-4 p-3 w-[300px] h-[500px] bg-white rounded-md items-center">
            <p className="text-lg font-medium">Unanswered Questions</p>
            <div className="flex flex-col gap-3 w-full h-px flex-grow overflow-y-auto">
              {unansweredItems.map((unansweredItem) => (
                <div className="w-full border border-gray-300 rounded-md">
                  <div className="flex items-center font-medium">
                    <p>Question {unansweredItem.itemNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>,
        );
      }
      return unansweredItems;
    }
    return [];
  }

  return (
    <button
      disabled={
        // answers.length === 0 ||
        submitAttemptStatus === "pending" || !items || items?.length === 0
      }
      onClick={async () => {
        try {
          const formData = new FormData();

          if (answers.length === 0) {
            toast.error("Error. No answers given.");
          }

          formData.append("attempt_id", attemptId);

          answers.forEach((answer, i) => {
            checkUnansweredItemsState(items, answers);

            formData.append(
              `answers[${i}][material_id]`,
              answer.assessmentMaterialId,
            );
            formData.append(
              `answers[${i}][material_type]`,
              answer.materialType,
            );
            if (answer.content?.trim()) {
              formData.append(`answers[${i}][content]`, answer.content);
            }
          });
          await submitAttempt(formData);
        } catch (error) {
          console.error(error);
          toast.error("An error occured. Please try again later.");
        }
      }}
      className="grid place-items-center text-[15px] font-medium py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
    >
      {submitAttemptStatus === "pending" ? (
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="size-5 animate-spin stroke-[3px]" />
          <p className="text-white">Loading</p>
        </div>
      ) : (
        <p className="text-white">Submit Attempt</p>
      )}
    </button>
  );
}
