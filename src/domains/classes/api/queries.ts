import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { CourseClass, GetCourseClasses } from "../types";

type UseCourseClassesArgs = {
  searchQuery: string | undefined;
  page: number | undefined;
};

export function useCourseClasses({ page, searchQuery }: UseCourseClassesArgs) {
  return useQuery({
    queryKey: ["courseClasses", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/course-classes", {
        params: { page, query: searchQuery },
      });
      return data as GetCourseClasses;
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
