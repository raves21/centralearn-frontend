import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { GetSemestersResponse } from "../types";

type UseSemesterArgs = {
  page: number | undefined;
  searchQuery: string | undefined;
};

export function useSemesters({ page = 1, searchQuery }: UseSemesterArgs) {
  return useQuery({
    queryKey: ["semesters", page, searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/semesters", {
        params: { page, query: searchQuery },
      });
      return data as GetSemestersResponse;
    },
  });
}
