import type { FileAttachment, PaginationProps } from "@/utils/sharedTypes";

export type OptionBasedItemOption = {
  id: string;
  // optionBasedItemId: string;
  optionText: string | null;
  optionFile: FileAttachment | null;
  isCorrect: boolean;
};

export type OptionBasedItem = {
  id: string;
  options: OptionBasedItemOption[];
  isOptionsAlphabetical: boolean;
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
  isCaseSensitive: boolean;
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
  questionText: string | null;
  questionFiles: FileAttachment[] | null;
};

export type AssessmentMaterialsPaginated = PaginationProps & {
  data: AssessmentMaterial[];
};

export type QuestionnaireOptionBasedItem = OptionBasedItem & {
  options: Omit<OptionBasedItemOption, "isCorrect">[]
}

export type QuestionnaireIdentificationItem = Omit<IdentificationItem, "acceptedAnswers">;

export type AssessmentQuestionnaire = (AssessmentMaterial & {question: EssayItem | QuestionnaireIdentificationItem | QuestionnaireOptionBasedItem})[]
