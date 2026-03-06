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
    questionnaireSnapshot: AssessmentMaterial[] | null;
  };
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
