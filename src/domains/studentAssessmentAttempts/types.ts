import type { AssessmentMaterial } from "../assessmentMaterials/types";

export type StudentAssessmentAttemptInfo = {
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

export type StudentAssessmentAttempt = {
  id: string;
  studentId: string;
  maxAchievableScore: number | null;
  assessmentVersion: {
    id: string;
    assessmentId: string;
    versionNumber: string;
    questionnaireSnapshot: AssessmentMaterial[] | null;
  };
  submissionSummary: Record<string, SubmissionSummaryItem> | null;
  attemptNumber: number;
  answers: {
    asmt_material_id: string;
    material_type: "option_based_item" | "essay_item" | "identification_item";
    content: string;
  }[];
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
