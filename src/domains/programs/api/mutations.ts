import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateProgram() {
  return useMutation({
    mutationFn: async (payload: FormData) => {
      await api.post("/programs", payload, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}
