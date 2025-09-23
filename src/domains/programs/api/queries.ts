import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { GetProgramsResponse } from "../types";

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
