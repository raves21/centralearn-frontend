import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { GetStudentsResponse, Student } from "../types";

type UseStudentsArgs = {
  page: number | undefined;
  searchQuery: string | undefined;
};

export function useStudents({ page = 1, searchQuery }: UseStudentsArgs) {
  return useQuery({
    queryKey: ["students", page, searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/students", {
        params: { page, query: searchQuery },
      });
      return data as GetStudentsResponse;
    },
  });
}

export function useStudentInfo(id: string) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const { data } = await api.get(`/students/${id}`);
      return data.data as Student;
    },
  });
}
