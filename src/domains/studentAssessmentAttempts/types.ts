import type { Assessment } from "../chapterContents/types";
import type { Student } from "../students/types";

export type AttemptAvailability = {
  attemptsLeft: number;
  continueAttempt: {
    attemptId: string;
    attemptNumber: number;
  } | null;
  canStartNewAttempt: boolean;
};

export type SubmissionSummaryItem = {
  is_correct: boolean;
  points_earned: number | null;
  answer_content: string | null;
};

export type AssessmentResult = {
  id: string;
  assessment: Assessment;
  finalScore: number | null;
  attempts?: StudentAssessmentAttempt[];
};

export type StudentAssessmentAttempt = {
  id: string;
  student: Student;
  assessmentResult: AssessmentResult;
  attemptNumber: number;
  answers: {
    asmt_material_id: string;
    material_type: "option_based_item" | "essay_item" | "identification_item";
    content: string;
  }[];
  submissionSummary: Record<string, SubmissionSummaryItem> | null;
  status: "ongoing" | "submitted";
  startedAt: string;
  submittedAt: string | null;
  totalScore: number | null;
};

export type ResultAndAttempts = {
  assessmentResult: {
    id: string;
    finalScore: number | null;
    maxScore: number;
    lastRecordedAt: string;
  };
  attempts: {
    id: string;
    totalScore: number | null;
    status: "ongoing" | "submitted";
    attemptNumber: number;
    submittedAt: string | null;
  }[];
};

export type Answer = {
  assessmentMaterialId: string;
  materialType: "option_based_item" | "essay_item" | "identification_item";
  content: string | null;
};

export type UnansweredItem = Omit<Answer, "content"> & {
  itemNumber: number;
};
