import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { GetCourses } from "../types";

type UseCoursesArgs = {
  searchQuery: string | undefined;
  page: number | undefined;
};

export function useCourses({ page, searchQuery }: UseCoursesArgs) {
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
