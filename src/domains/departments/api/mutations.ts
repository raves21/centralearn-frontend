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

export function useEditDepartment() {
  return useMutation({
    mutationFn: async ({
      departmentId,
      payload,
    }: {
      departmentId: string;
      payload: FormData;
    }) => {
      await api.post(`/departments/${departmentId}`, payload, {
        headers: { "Content-Type": "multipart/formdata" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
  });
}
