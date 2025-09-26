import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateStudent() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/students", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
