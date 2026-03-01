import type { AssessmentMaterial } from "../assessmentMaterials/types";

export type StudentAssessmentAttemptInfo = {
  attemptsLeft: number;
  continueAttempt: {
    attemptId: string;
    attemptNumber: number;
  } | null;
  canStartNewAttempt: boolean;
};

export type StudentAssessmentAttempt = {
  id: string;
  studentId: string;
  assessmentVersion: {
    id: string;
    assessmentId: string;
    versionNumber: string;
    questionnaire: AssessmentMaterial[];
  };
  attemptNumber: number;
  answers: {
    material_id: string;
    material_type:
      | "App\\Models\\OptionBasedItem"
      | "App\\Models\\EssayItem"
      | "App\\Models\\IdentificationItem";
    content: string;
  }[];
  status: "ongoing" | "submitted";
  startedAt: string;
  submittedAt: string | null;
  totalScore: number | null;
};
