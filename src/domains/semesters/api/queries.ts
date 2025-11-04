import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type {
  SemestersPaginated,
  Semester,
  SemesterMinMaxTimestamps,
} from "../types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";

export function useSemesters({
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: ["semesters", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/semesters", {
        params: { page, query: searchQuery },
      });
      return data as SemestersPaginated;
    },
  });
}

export function useAllSemesters({
  searchQuery = undefined,
}: {
  searchQuery?: string;
}) {
  return useQuery({
    queryKey: ["semesters", "allSemesters", searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/semesters", {
        params: { query: searchQuery, paginate: 0 },
      });
      return data.data as Semester[];
    },
  });
}

export function useCreateSemesterMinMaxTimestamps() {
  return useQuery({
    queryKey: ["createSemesterMinMaxTimestamps"],
    queryFn: async () => {
      const { data } = await api.get(
        "/semesters/create-semester-get-minmax-timestamps"
      );
      return data as SemesterMinMaxTimestamps;
    },
  });
}
