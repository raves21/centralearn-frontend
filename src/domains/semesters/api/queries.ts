import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type {
  GetSemestersResponse,
  Semester,
  SemesterMinMaxTimestamps,
} from "../types";

export function useSemesters({
  page = 1,
  searchQuery,
}: {
  page: number | undefined;
  searchQuery: string | undefined;
}) {
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
