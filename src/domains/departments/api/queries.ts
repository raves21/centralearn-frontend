import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import type { Department, GetDepartmentsResponse } from "../types";

export function useDepartments({
  page = 1,
  searchQuery = undefined,
}: {
  page?: number;
  searchQuery?: string;
}) {
  return useQuery({
    queryKey: ["departments", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/departments", {
        params: { page, query: searchQuery },
      });
      return data as GetDepartmentsResponse;
    },
  });
}

export function useAllDepartments({
  searchQuery = undefined,
}: {
  searchQuery?: string;
}) {
  return useQuery({
    queryKey: ["departments", "allDepartments", searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/departments", {
        params: { query: searchQuery, paginate: 0 },
      });
      return data.data as Department[];
    },
  });
}

export function useDepartmentInfo({ departmentId }: { departmentId: string }) {
  return useQuery({
    queryKey: ["department", departmentId],
    queryFn: async () => {
      const { data } = await api.get(`/departments/${departmentId}`);
      return data.data as Department;
    },
  });
}
