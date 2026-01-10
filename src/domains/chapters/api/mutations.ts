import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateChapter() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/chapters", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useEditChapter() {
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      await api.post(`/chapters/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useDeleteChapter() {
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/chapters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useReorderChapterBulk() {
  return useMutation({
    mutationFn: async (
      chapters: {
        id: string;
        new_order: number;
      }[]
    ) => {
      await api.post("/chapters/reorder-bulk", { chapters });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}
