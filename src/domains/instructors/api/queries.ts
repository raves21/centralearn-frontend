import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { InstructorsPaginated, Instructor } from "../types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";

export function useInstructors({
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: ["instructors", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/instructors", {
        params: { page, query: searchQuery },
      });
      return data as InstructorsPaginated;
    },
  });
}

export function useInstructorInfo(id: string) {
  return useQuery({
    queryKey: ["instructor", id],
    queryFn: async () => {
      const { data } = await api.get(`/instructors/${id}`);
      return data.data as Instructor;
    },
  });
}
