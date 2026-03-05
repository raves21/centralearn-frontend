import { toast } from "sonner";
import { useSubmitAttempt } from "../api/mutations";
import type { Answer } from "../stores/useAttemptAnswersStore";
import { Loader2 } from "lucide-react";

type Props = {
  attemptId: string;
  answers: Answer[];
};

export default function SubmitButton({ answers, attemptId }: Props) {
  const { mutateAsync: submitAttempt, status: submitAttemptStatus } =
    useSubmitAttempt();

  return (
    <button
      disabled={answers.length === 0 || submitAttemptStatus === "pending"}
      onClick={async () => {
        try {
          const formData = new FormData();

          if (answers.length === 0) {
            toast.error("Error. No answers given.");
          }

          formData.append("attempt_id", attemptId);

          answers.forEach((answer, i) => {
            //todo: handle unanswers questions here. this is just temp
            if (!answer.content) {
              throw new Error("There are unanswered questions.");
            }
            formData.append(`answers[${i}][material_id]`, answer.materialId);
            formData.append(
              `answers[${i}][material_type]`,
              answer.materialType,
            );
            formData.append(`answers[${i}][content]`, answer.content);
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
