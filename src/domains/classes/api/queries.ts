import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { GetAllCourseClasses } from "../types";

type UseCourseClassesArgs = {
  searchQuery: string | undefined;
  page: number | undefined;
};

export function useCourseClasses({ page, searchQuery }: UseCourseClassesArgs) {
  return useQuery({
    queryKey: ["courseClasses", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/course-classes");
      console.log("DATA", data);
      return data as GetAllCourseClasses;
    },
  });
}
