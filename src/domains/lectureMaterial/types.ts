import type { FileAttachment, PaginationProps, TextAttachment } from "@/utils/sharedTypes";

export type LectureMaterial = {
    id: string;
    lectureId: string;
    order: number;
    materialId: string;
    materialType: "App\\Models\\TextAttachment" | "App\\Models\\FileAttachment";
    material: TextAttachment | FileAttachment;
}

export type LectureMaterialsPaginated = PaginationProps & {
    data: LectureMaterial[]
}