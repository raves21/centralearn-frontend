import type {
  FileAttachment,
  PaginationProps,
  TextAttachment,
} from "@/utils/sharedTypes";

export type LectureMaterial = {
  id: string;
  lectureId: string;
  order: number;
  materialId: string;
  materialType: "App\\Models\\TextAttachment" | "App\\Models\\FileAttachment";
  material: TextAttachment | FileAttachment;
};

export type LectureMaterialsPaginated = PaginationProps & {
  data: LectureMaterial[];
};

export type NewMaterial = {
  lecture_id: string;
  material_type: "text" | "file";
  order: number;
  material_content?: string;
  material_file?: File;
};

export type UpdatedMaterial = {
  id: string;
  material_type: "text" | "file";
  order: number;
  is_material_updated: boolean;
  material?: {
    content?: string;
    file?: File;
  };
};

export type BulkChangesPayload = {
  new?: NewMaterial[];
  updated?: UpdatedMaterial[];
  deleted?: string[];
};
