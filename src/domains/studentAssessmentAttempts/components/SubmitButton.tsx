import { toast } from "sonner";
import { useSubmitAttempt } from "../api/mutations";
import { BadgeCheck, Loader2 } from "lucide-react";
import type { AssessmentMaterial } from "@/domains/assessmentMaterials/types";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { getHtmlStringText } from "@/utils/sharedFunctions";
import UnansweredItemsWarningDialog from "./UnansweredItemsWarningDialog";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { useNavigate } from "@tanstack/react-router";
import ConfirmationDialog from "@/components/shared/globals/ConfirmationDialog";
import { buildSubmitAttemptPayload } from "../sharedFunctions";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";
import type { Answer, UnansweredItem } from "../types";

type Props = {
  attemptId: string;
  answers: Answer[];
  items: AssessmentMaterial[] | null;
  classId: string;
};

export default function SubmitButton({
  answers,
  attemptId,
  items,
  classId,
}: Props) {
  const { mutateAsync: submitAttempt, status: submitAttemptStatus } =
    useSubmitAttempt();

  const setUnansweredItems = useAttemptAnswersStore(
    (state) => state.setUnansweredItems,
  );

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const navigate = useNavigate();

  usePendingOverlay({
    isPending: submitAttemptStatus === "pending",
    pendingLabel: "Submitting Attempt",
  });

  function showAttemptSubmittedDialog() {
    setTimeout(() => {
      toggleOpenDialog(
        <div className="h-[500px] w-[400px] flex flex-col p-6 bg-white rounded-md">
          <div className="flex flex-col justify-center items-center gap-10 flex-grow text-center">
            <BadgeCheck className="stroke-green-500/40 size-[180px]" />
            <p className="text-2xl font-medium">
              Attempt submitted successfully!
            </p>
          </div>
          <button
            onClick={() => toggleOpenDialog(null)}
            className="w-full bg-mainaccent text-white rounded-md hover:bg-indigo-800 py-4 grid place-items-center"
          >
            OK
          </button>
        </div>,
      );
    }, 300);
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
            if (!getHtmlStringText(foundAnswer.content)) {
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
          <UnansweredItemsWarningDialog
            onSubmit={async () => {
              try {
                const formData = buildSubmitAttemptPayload(attemptId, answers);
                await submitAttempt(formData);
                toggleOpenDialog(null);
                navigate({
                  to: "/lms/classes/$classId",
                  params: {
                    classId,
                  },
                });
                showAttemptSubmittedDialog();
              } catch (error) {
                toast.error("An error occured. Please try again later.");
              }
            }}
            unansweredItems={unansweredItems}
          />,
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
        const formData = buildSubmitAttemptPayload(attemptId, answers);
        const unansweredItems = checkUnansweredItemsState(items, answers);

        if (unansweredItems.length === 0) {
          toggleOpenDialog(
            <ConfirmationDialog
              confirmationMessage="Are you sure you want to submit?"
              onClickYes={async () => {
                try {
                  await submitAttempt(formData);
                  toggleOpenDialog(null);
                  navigate({
                    to: "/lms/classes/$classId",
                    params: {
                      classId,
                    },
                  });
                  showAttemptSubmittedDialog();
                } catch (error) {
                  toast.error("An error occured. Please try again later.");
                }
              }}
            />,
          );
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
