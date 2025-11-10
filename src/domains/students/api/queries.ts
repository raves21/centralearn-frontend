import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { StudentsPaginated, Student } from "../types";
import type { CourseClassesPaginated } from "@/domains/classes/types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";

export function useStudents({
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: ["students", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/students", {
        params: { page, query: searchQuery },
      });
      return data as StudentsPaginated;
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

export function useStudentEnrolledClasses({
  studentId,
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams & { studentId: string }) {
  return useQuery({
    queryKey: [
      "studentEnrolledClasses",
      "courseClasses",
      page,
      searchQuery,
      studentId,
    ],
    queryFn: async () => {
      const { data } = await api.get(
        `/students/${studentId}/classes-enrolled`,
        { params: { paginate: 1, page, query: searchQuery } }
      );

      return data as CourseClassesPaginated;
    },
  });
}

export function useStudentEnrollableClasses({
  studentId,
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams & { studentId: string }) {
  return useQuery({
    queryKey: [
      "studentEnrollableClasses",
      "courseClasses",
      studentId,
      page,
      searchQuery,
    ],
    queryFn: async () => {
      const { data } = await api.get(
        `/students/${studentId}/enrollable-classes`,
        {
          params: {
            page,
            query: searchQuery,
          },
        }
      );
      return data as CourseClassesPaginated;
    },
  });
}
