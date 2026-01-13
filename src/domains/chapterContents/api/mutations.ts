import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateLecture() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/contents", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useCreateAssessment() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/contents", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useEditAssessment() {
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      await api.put(`/contents/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useEditLecture() {
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      await api.put(`/contents/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useDeleteChapterContent() {
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/contents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useReorderChapterContentBulk() {
  return useMutation({
    mutationFn: async (
      contents: {
        id: string;
        new_order: number;
      }[]
    ) => {
      await api.post("/contents/reorder-bulk", { contents });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}
