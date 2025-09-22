import { api } from "@/utils/axiosBackend";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { GetProgramsResponse } from "../types";
import { queryClient } from "@/utils/queryClient";

type UseProgramsArgs = {
  page: number | undefined;
  searchQuery: string | undefined;
};

export function usePrograms({ page = 1, searchQuery }: UseProgramsArgs) {
  return useQuery({
    queryKey: ["programs", page, searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/programs", {
        params: { page, query: searchQuery },
      });
      return data as GetProgramsResponse;
    },
  });
}

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
