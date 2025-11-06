import { api } from "@/utils/axiosBackend";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";
import { useQuery } from "@tanstack/react-query";
import type { Section, SectionsPaginated } from "../types";

export function useSections({
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: ["sections", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/sections", {
        params: {
          page,
          query: searchQuery,
        },
      });

      return data as SectionsPaginated;
    },
  });
}

export function useAllSections() {
  return useQuery({
    queryKey: ["allSections", "sections"],
    queryFn: async () => {
      const { data } = await api.get("/sections", {
        params: {
          paginate: false,
        },
      });
      return data.data as Section[];
    },
  });
}

export function useSectionInfo(id: string) {
  return useQuery({
    queryKey: ["section", id],
    queryFn: async () => {
      const { data } = await api.get(`/sections/${id}`);

      return data.data as Section;
    },
  });
}
