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

export type SyncMaterialItem = {
  id?: string | null;
  material_type: "text" | "file";
  order: number;
  material_content?: string;
  material_file?: File;
};

export type BulkChangesPayload = {
  lecture_id: string;
  materials: SyncMaterialItem[];
};
