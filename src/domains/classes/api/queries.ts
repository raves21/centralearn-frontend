import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { CourseClass, CourseClassesPaginated } from "../types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";
import type { Student, StudentsPaginated } from "@/domains/students/types";
import type { Instructor } from "@/domains/instructors/types";

export function useCourseClasses({
  page = 1,
  searchQuery = undefined,
  filters,
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: ["courseClasses", page, searchQuery, JSON.stringify(filters)],
    queryFn: async () => {
      const { data } = await api.get("/course-classes", {
        params: { page, query: searchQuery, ...filters },
      });
      return data as CourseClassesPaginated;
    },
  });
}

export function useAllCourseClasses() {
  return useQuery({
    queryKey: ["allCourseClasses", "courseClasses"],
    queryFn: async () => {
      const { data } = await api.get("/course-classes", {
        params: {
          paginate: false,
        },
      });
      return data;
    },
  });
}

export function useCourseClassInfo(id: string) {
  return useQuery({
    queryKey: ["courseClass", id],
    queryFn: async () => {
      const { data } = await api.get(`/course-classes/${id}`);
      return data.data as CourseClass;
    },
  });
}

export function useCourseClassMembers({
  id,
  searchQuery = undefined,
}: PaginatedQueryParams & { id: string }) {
  return useQuery({
    queryKey: ["courseClassMembers", id, searchQuery],
    queryFn: async () => {
      const { data } = await api.get(`/course-classes/${id}/members`, {
        params: { query: searchQuery },
      });
      return data as {
        instructors: Instructor[];
        students: Student[];
      };
    },
  });
}
