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

export function useEditProgram() {
  return useMutation({
    mutationFn: async ({
      programId,
      payload,
    }: {
      programId: string;
      payload: FormData;
    }) => {
      await api.post(`/programs/${programId}`, payload, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["program"] });
    },
  });
}
