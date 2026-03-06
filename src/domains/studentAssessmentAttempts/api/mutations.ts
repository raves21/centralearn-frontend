import { api } from "@/utils/axiosBackend";
import { useMutation } from "@tanstack/react-query";
import type { StudentAssessmentAttempt } from "../types";
import type { Answer } from "../stores/useAttemptAnswersStore";
import { toast } from "sonner";

export function useSubmitAttempt() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/student-assessment-attempts/submit-attempt", formData);
    },
  });
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: async ({
      studentId,
      assessmentId,
    }: {
      studentId: string;
      assessmentId: string;
    }) => {
      const { data } = await api.post(
        "/student-assessment-attempts/start-attempt",
        { student_id: studentId, assessment_id: assessmentId },
      );
      return data.data as StudentAssessmentAttempt;
    },
  });
}
export function useUpdateAttemptAnswers() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post(
        "/student-assessment-attempts/update-attempt-answers",
        formData,
      );
    },
  });
}

export function useUpdateAttemptAnswer() {
  return useMutation({
    mutationFn: async ({
      attemptId,
      answer,
    }: {
      attemptId: string;
      answer: Answer & { content: string };
    }) => {
      await api.post("/student-assessment-attempts/update-attempt-answer", {
        attempt_id: attemptId,
        answer: {
          asmt_material_id: answer.assessmentMaterialId,
          material_type: answer.materialType,
          content: answer.content,
        },
      });
    },
    onSuccess: () => {
      toast.success("Answers updated.");
    },
    onError: () => {
      toast.error("A server error occured while syncing answers.");
    },
  });
}
