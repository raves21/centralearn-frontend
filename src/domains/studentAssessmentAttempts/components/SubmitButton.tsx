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

  function buildFormDataPayload(attemptId: string, answers: Answer[]) {
    const formData = new FormData();

    formData.append("attempt_id", attemptId);

    answers.forEach((answer, i) => {
      formData.append(
        `answers[${i}][asmt_material_id]`,
        answer.assessmentMaterialId,
      );
      formData.append(`answers[${i}][material_type]`, answer.materialType);
      if (answer.content?.trim()) {
        formData.append(`answers[${i}][content]`, answer.content);
      }
    });
    return formData;
  }

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
        let answerFoundButNoContent = false;

        if (foundAnswer) {
          if (item.materialType === "App\\Models\\EssayItem") {
            //since essay items are html strings due to tiptap editor, we must extract the text content only
            const html = foundAnswer.content!;
            const div = document.createElement("div");
            div.innerHTML = html;

            if (!div.textContent.trim()) {
              answerFoundButNoContent = true;
            }
          } else if (item.materialType === "App\\Models\\IdentificationItem") {
            if (!foundAnswer.content?.trim()) {
              answerFoundButNoContent = true;
            }
          }
        }

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
          <div className="flex flex-col gap-8 p-6 w-[500px] h-[400px] bg-white rounded-md">
            {/* Header */}
            <p className="text-lg font-medium text-center">
              Unanswered Questions
            </p>

            {/* Scrollable section */}
            <div className="flex flex-col gap-3 w-full flex-1 min-h-0 overflow-y-auto bg-red-200">
              {unansweredItems.map((unansweredItem) => (
                <button
                  key={unansweredItem.assessmentMaterialId}
                  onClick={() => {
                    const itemRef = document.getElementById(
                      unansweredItem.assessmentMaterialId,
                    );

                    if (itemRef) {
                      toggleOpenDialog(null);
                      itemRef.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-4 hover:bg-gray-100"
                >
                  <div className="flex items-center font-medium">
                    <p>Question {unansweredItem.itemNumber}</p>
                  </div>
                </button>
              ))}

              {/* Just to demonstrate overflow */}
              <div className="w-full h-[800px] bg-red-500"></div>
            </div>

            {/* Footer */}
            <div className="flex items-center h-[15%] w-full gap-3">
              <button
                onClick={() => toggleOpenDialog(null)}
                className="w-1/2 h-full grid place-items-center bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Close
              </button>

              <button className="w-1/2 h-full grid place-items-center bg-mainaccent hover:bg-indigo-800 text-white rounded-md">
                Submit Anyway
              </button>
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
        submitAttemptStatus === "pending" || !items || items?.length === 0
      }
      onClick={async () => {
        try {
          const formData = buildFormDataPayload(attemptId, answers);
          const unansweredItems = checkUnansweredItemsState(items, answers);

          if (unansweredItems.length === 0) {
            await submitAttempt(formData);
          }
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
