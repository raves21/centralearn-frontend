import type { FileAttachment, PaginationProps } from "@/utils/sharedTypes";

export type OptionBasedItemOption = {
  id: string;
  optionBasedItemId: string;
  optionText: string | null;
  optionFile: FileAttachment | null;
  isCorrect: boolean;
};

export type OptionBasedItem = {
  id: string;
  options: OptionBasedItemOption[];
};

export type EssayItem = {
  id: string;
  minCharacterCount: number | null;
  maxCharacterCount: number | null;
  minWordCount: number | null;
  maxWordCount: number | null;
};

export type IdentificationItem = {
  acceptedAnswers: string[];
};

export type AssessmentMaterial = {
  id: string;
  assessmentId: string;
  order: number;
  materialId: string;
  pointWorth: number;
  materialType:
    | "App\\Models\\OptionBasedItem"
    | "App\\Models\\EssayItem"
    | "App\\Models\\IdentificationItem";
  material: OptionBasedItem | EssayItem | IdentificationItem;
  question: AssessmentMaterialQuestion;
};

export type AssessmentMaterialQuestion = {
  id: string;
  assessmentMaterialId: string;
  questionText: string;
  questionFiles: FileAttachment[];
};

export type AssessmentMaterialsPaginated = PaginationProps & {
  data: AssessmentMaterial[];
};

// export type BulkChangesPayload = {
//   assessment_id: string
//   materials:
// }
