import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { Course, GetCourses } from "../types";

export function useCourses({
  page,
  searchQuery,
}: {
  searchQuery?: string;
  page: number | undefined;
}) {
  return useQuery({
    queryKey: ["courses", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/courses", {
        params: { page, query: searchQuery },
      });
      return data as GetCourses;
    },
  });
}

export function useAllCourses({
  searchQuery = undefined,
}: {
  searchQuery?: string;
}) {
  return useQuery({
    queryKey: ["courses", "allCourses", searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/courses", {
        params: { query: searchQuery, paginate: 0 },
      });
      return data.data as Course[];
    },
  });
}

export function useCourseInfo(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${courseId}`);
      return data.data as Course;
    },
  });
}
