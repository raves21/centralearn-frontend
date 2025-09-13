import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateDepartment() {
  return useMutation({
    mutationFn: async (payload: FormData) => {
      await api.post("/departments", payload, {
        headers: { "Content-Type": "multipart/formdata" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
