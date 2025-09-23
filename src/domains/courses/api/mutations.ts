import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateCourse() {
  return useMutation({
    mutationFn: async (payload: FormData) => {
      await api.post("/courses", payload, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
