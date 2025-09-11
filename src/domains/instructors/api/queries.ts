import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { GetInstructorsResponse } from "../types";

type UseInstructorsArgs = {
  page: number | undefined;
  searchQuery: string | undefined;
};

export function useInstructors({ page = 1, searchQuery }: UseInstructorsArgs) {
  return useQuery({
    queryKey: ["instructors", page, searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/instructors", {
        params: { page, query: searchQuery },
      });
      return data as GetInstructorsResponse;
    },
  });
}
