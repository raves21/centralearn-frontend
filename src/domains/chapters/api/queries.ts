import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { Chapter } from "../types";

export function useCourseClassChapters({ classId }: { classId: string }) {
  return useQuery({
    queryKey: ["chapters", classId],
    queryFn: async () => {
      const { data } = await api.get(`/chapters`, {
        params: {
          course_class_id: classId,
        },
      });
      return data.data as Chapter[];
    },
  });
}
