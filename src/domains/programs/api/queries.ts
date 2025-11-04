import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { ProgramsPaginated, Program } from "../types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";

export function usePrograms({
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: ["programs", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/programs", {
        params: { page, query: searchQuery },
      });
      return data as ProgramsPaginated;
    },
  });
}

export function useAllPrograms({ searchQuery }: { searchQuery?: string }) {
  return useQuery({
    queryKey: ["programs", "allPrograms", searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/programs", {
        params: { query: searchQuery, paginate: 0 },
      });
      return data.data as Program[];
    },
  });
}

export function useProgramInfo({ programId }: { programId: string }) {
  return useQuery({
    queryKey: ["program", programId],
    queryFn: async () => {
      const { data } = await api.get(`/programs/${programId}`);
      return data.data as Program;
    },
  });
}
