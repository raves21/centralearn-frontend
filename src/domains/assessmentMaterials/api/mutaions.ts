import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useProcessBulkAssessmentMaterials() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/assessment-materials/process-bulk", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessmentMaterials"] });
    },
  });
}
