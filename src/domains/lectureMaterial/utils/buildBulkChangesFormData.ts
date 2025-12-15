import type { BulkChangesPayload } from "../types";

/**
 * Builds FormData from bulk changes payload according to Laravel validation rules
 */
export function buildBulkChangesFormData(
  payload: BulkChangesPayload
): FormData {
  const formData = new FormData();

  // Add new materials
  if (payload.new && payload.new.length > 0) {
    payload.new.forEach((material, index) => {
      formData.append(`new[${index}][lecture_id]`, material.lecture_id);
      formData.append(`new[${index}][material_type]`, material.material_type);
      formData.append(`new[${index}][order]`, material.order.toString());

      if (material.material_type === "text" && material.material_content) {
        formData.append(
          `new[${index}][material_content]`,
          material.material_content
        );
      } else if (material.material_type === "file" && material.material_file) {
        formData.append(`new[${index}][material_file]`, material.material_file);
      }
    });
  }

  // Add updated materials
  if (payload.updated && payload.updated.length > 0) {
    payload.updated.forEach((material, index) => {
      formData.append(`updated[${index}][id]`, material.id);
      formData.append(
        `updated[${index}][material_type]`,
        material.material_type
      );
      formData.append(`updated[${index}][order]`, material.order.toString());
      formData.append(
        `updated[${index}][is_material_updated]`,
        Number(material.is_material_updated).toString()
      );

      if (material.material && material.is_material_updated) {
        if (material.material_type === "text" && material.material.content) {
          formData.append(
            `updated[${index}][material][content]`,
            material.material.content
          );
        } else if (
          material.material_type === "file" &&
          material.material.file
        ) {
          formData.append(
            `updated[${index}][material][file]`,
            material.material.file
          );
        }
      }
    });
  }

  // Add deleted materials
  if (payload.deleted && payload.deleted.length > 0) {
    payload.deleted.forEach((id, index) => {
      formData.append(`deleted[${index}]`, id);
    });
  }

  return formData;
}
