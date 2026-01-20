import type { PaginationProps } from "@/utils/sharedTypes";

export type OptionBasedItemOption = {
  id: string;
  optionBasedItemId: string;
  optionText: string | null;
  optionFile: string | null;
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
  materialType:
    | "App\\Models\\OptionBasedQuestion"
    | "App\\Models\\EssayQuestion"
    | "App\\Models\\IdentificationQuestion";
  material: OptionBasedItem | EssayItem | IdentificationItem;
  question: AssessmentMaterialQuestion;
};

export type AssessmentMaterialQuestion = {
  id: string;
  assessmentMaterialId: string;
  questionText: string;
  questionFiles: string[];
};

export type AssessmentMaterialsPaginated = PaginationProps & {
  data: AssessmentMaterial[];
};
