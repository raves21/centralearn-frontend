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

export function useChapterInfo(id: string | undefined) {
  return useQuery({
    queryKey: ["chapter", id],
    queryFn: async () => {
      const { data } = await api.get(`/chapters/${id}`);
      return data.data as Chapter;
    },
    enabled: !!id,
  });
}
