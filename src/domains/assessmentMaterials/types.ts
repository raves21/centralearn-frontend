import type { PaginationProps } from "@/utils/sharedTypes";

export type OptionBasedItemOption = {
  id: string;
  optionBasedItemId: string;
  optionableId: string;
  optionableType: "App\\Models\\FileAttachment" | "App\\Models\\TextAttachment";
  isCorrect: boolean;
};

export type OptionBasedItem = {
  id: string;
  options: OptionBasedItemOption[];
};

export type EssayItem = {
  id: string;
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
