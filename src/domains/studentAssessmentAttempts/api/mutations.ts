import { api } from "@/utils/axiosBackend";
import { useMutation } from "@tanstack/react-query";
import type { StudentAssessmentAttempt } from "../types";

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
