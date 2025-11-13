import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { InstructorsPaginated, Instructor } from "../types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";
import type { CourseClassesPaginated } from "@/domains/classes/types";

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

export function useInstructorAssignedClasses({
  instructorId,
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams & { instructorId: string }) {
  return useQuery({
    queryKey: [
      "instructorAssignedClasses",
      "courseClasses",
      instructorId,
      page,
      searchQuery,
    ],
    queryFn: async () => {
      const { data } = await api.get(
        `/instructors/${instructorId}/classes-assigned`,
        {
          params: {
            page,
            query: searchQuery,
            paginate: 1,
          },
        }
      );
      return data as CourseClassesPaginated;
    },
  });
}

export function useInstructorAssignableClasses({
  instructorId,
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams & { instructorId: string }) {
  return useQuery({
    queryKey: [
      "instructorAssignableClasses",
      "courseClasses",
      instructorId,
      page,
      searchQuery,
    ],
    queryFn: async () => {
      const { data } = await api.get(
        `/instructors/${instructorId}/assignable-classes`,
        {
          params: {
            page,
            query: searchQuery,
          },
        }
      );
      return data as CourseClassesPaginated;
    },
  });
}
