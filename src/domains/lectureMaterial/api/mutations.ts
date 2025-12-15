import { api } from "@/utils/axiosBackend";
import { useMutation } from "@tanstack/react-query";

export function useProcessBulkLectureMaterials() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/lecture-materials/process-bulk", formData);
    },
  });
}
