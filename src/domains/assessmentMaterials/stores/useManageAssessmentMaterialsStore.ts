import { create } from "zustand";

type FileAttachment = {
  type: "file";
  content: File | string; // File for new uploads, string URL for existing files
};

type TextAttachment = {
  type: "text";
  content: string;
};

type MaterialQuestion = {
  questionText: string;
  questionFiles: File[];
};

type OptionBasedItemOption = {
  label: string;

  isCorrect: boolean;
} & (FileAttachment | TextAttachment)[];

type OptionBasedItemBlock = {
  type: "optionBasedItem";
  options: OptionBasedItemOption[];
};

type EssayItemBlock = {
  type: "essayItem";
  maxCharCount?: number;
  minCharCount?: number;
  maxWordCount?: number;
  minWordCount?: number;
};

type IdentificationItemBlock = {
  type: "identificationItem";
  acceptedAnswers: string[];
};

type ContentBlock = {
  id: string; // Client-side UUID
  dbId?: string; // Database ID (only for existing materials)
  isModified?: boolean; // Track if content changed
  materialQuestion: MaterialQuestion;
  materialType: "optionBasedItem" | "essayItem" | "identificationItem";
  material: OptionBasedItemBlock | EssayItemBlock | IdentificationItemBlock;
};

// export const useManageAssessmentMaterialsStore =
