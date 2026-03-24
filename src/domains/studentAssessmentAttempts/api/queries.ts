import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type {
  ResultAndAttempts,
  StudentAssessmentAttempt,
  AttemptAvailability,
  StudentAssessmentAttemptInfoWithAssessment,
} from "../types";
import { neverRefetchSettings } from "@/utils/queryClient";

export function useAttemptAvailability({
  studentId,
  assessmentId,
}: {
  studentId?: string;
  assessmentId: string;
}) {
  return useQuery({
    queryKey: ["studentAssessmentAttemptInfo", studentId, assessmentId],
    queryFn: async () => {
      const { data } = await api.get(
        "/student-assessment-attempts/student-assessment-attempt-availability",
        {
          params: {
            student_id: studentId,
            assessment_id: assessmentId,
          },
        },
      );
      return data as AttemptAvailability;
    },
    enabled: !!studentId,
  });
}

export function useAttemptInfo(attemptId: string) {
  return useQuery({
    queryKey: ["attemptInfo", attemptId],
    queryFn: async () => {
      const { data } = await api.get(
        `/student-assessment-attempts/${attemptId}`,
      );

      return {
        data: data.data,
        assessment: data.assessment,
      } as StudentAssessmentAttemptInfoWithAssessment;
    },
  });
}

export function useResultAndAttempts(
  studentId: string | undefined,
  assessmentId: string,
) {
  return useQuery({
    queryKey: ["studentAssessmentResultAndAttempts", studentId, assessmentId],
    queryFn: async () => {
      const { data } = await api.get(
        "/assessment-results/result-and-attempts",
        {
          params: {
            student_id: studentId,
            assessment_id: assessmentId,
          },
        },
      );

      return data as ResultAndAttempts;
    },
    enabled: !!studentId,
  });
}

export function useAttemptRemainingTime(attemptId: string) {
  return useQuery({
    queryKey: ["attemptRemainingTime", attemptId],
    queryFn: async () => {
      const { data } = await api.get(
        `/student-assessment-attempts/${attemptId}/remaining-time`,
      );

      return data as number | null;
    },
    ...neverRefetchSettings,
  });
}
