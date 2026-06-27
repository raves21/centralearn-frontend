import { getHtmlStringText } from "@/utils/sharedFunctions";
import type { Answer } from "./types";

export function buildSubmitAttemptPayload(
  attemptId: string,
  answers: Answer[],
) {
  const formData = new FormData();

  formData.append("attempt_id", attemptId);

  answers.forEach((answer, i) => {
    formData.append(
      `answers[${i}][asmt_material_id]`,
      answer.assessmentMaterialId,
    );
    formData.append(`answers[${i}][material_type]`, answer.materialType);
    if (getHtmlStringText(answer.content?.trim())) {
      formData.append(`answers[${i}][content]`, answer.content!.trim());
    }
  });
  return formData;
}
