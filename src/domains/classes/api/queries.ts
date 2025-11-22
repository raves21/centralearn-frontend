import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { CourseClass, CourseClassesPaginated } from "../types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";

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

export function useCourseClassInfo(courseClassId: string) {
  return useQuery({
    queryKey: ["courseClass", courseClassId],
    queryFn: async () => {
      const { data } = await api.get(`/course-classes/${courseClassId}`);
      return data.data as CourseClass;
    },
  });
}
