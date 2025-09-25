import { useMutation } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";

export function useCreateCourseClass() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/course-classes", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseClasses"] });
    },
  });
}
