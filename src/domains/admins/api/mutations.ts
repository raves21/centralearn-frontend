import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateAdmin() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/admins", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useEditAdmin() {
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      await api.post(`/admins/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
