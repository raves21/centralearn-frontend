import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { GetAllCourses } from "../types";

type UseCoursesArgs = {
  searchQuery: string | undefined;
  page: number | undefined;
};

export function useCourses({ page, searchQuery }: UseCoursesArgs) {
  return useQuery({
    queryKey: ["course", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/courses");
      return data as GetAllCourses;
    },
  });
}
