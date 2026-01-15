import type { PaginationProps } from "@/utils/sharedTypes";

export type OptionBasedQuestion = {
  id: string;
  questionText: string
  pointWorth: number
};

export type EssayQuestion = {
  id: string;
  questionText: string;
  pointWorth: number
};

export type IdentificationQuestion = {

}

export type AssessmentMaterial = {
  id: string;
  assessmentId: string;
  order: number;
  materialId: string;
  materialType: "App\\Models\\OptionBasedQuestion" | "App\\Models\\EssayQuestion" | "App\\Models\\IdentificationQuestion";
  material: OptionBasedQuestion | EssayQuestion | IdentificationQuestion;
};

export type AssessmentMaterialsPaginated = PaginationProps & {
  data: AssessmentMaterial[];
};

export type NewMaterial = {
//   assessment_id: string;
//   material_type: "text" | "file";
//   order: number;
//   material_content?: string;
//   material_file?: File;
};

export type UpdatedMaterial = {
//   id: string;
//   material_type: "text" | "file";
//   order: number;
//   is_material_updated: boolean;
//   material?: {
//     content?: string;
//     file?: File;
//   };
};

export type BulkChangesPayload = {
  new?: NewMaterial[];
  updated?: UpdatedMaterial[];
  deleted?: string[];
}; 