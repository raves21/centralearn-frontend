import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type {
  StudentAssessmentAttempt,
  StudentAssessmentAttemptInfo,
} from "../types";

export function useStudentAssessmentAttemptAvailability({
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
      return data as StudentAssessmentAttemptInfo;
    },
    enabled: !!studentId,
  });
}

export function useStudentAssessmentAttemptInfo(attemptId: string) {
  return useQuery({
    queryKey: ["attemptInfo", attemptId],
    queryFn: async () => {
      const { data } = await api.get(
        `/student-assessment-attempts/${attemptId}`,
      );

      return {
        data: data.data as StudentAssessmentAttempt,
        assessment: data.assessment as {
          id: string;
          name: string;
          chapterContent: {
            id: string;
            name: string;
            chapter: {
              id: string;
              name: string;
            };
          };
        },
      };
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

      return data as {
        id: string;
        finalScore: number | null;
        maxScore: number;
        lastRecordedAt: string;
        attempts: {
          id: string;
          totalScore: number | null;
          status: "ongoing" | "submitted";
          attemptNumber: number;
          submittedAt: string;
        }[];
      };
    },
    enabled: !!studentId,
  });
}
