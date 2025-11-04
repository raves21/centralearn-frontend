import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { Admin, AdminsPaginated } from "../types";
import type { PaginatedQueryParams } from "@/utils/sharedTypes";

export function useAdmins({
  page = 1,
  searchQuery = undefined,
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: ["admins", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/admins", {
        params: { page, query: searchQuery },
      });
      return data as AdminsPaginated;
    },
  });
}

export function useAdminInfo(id: string) {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: async () => {
      const { data } = await api.get(`/admins/${id}`);
      return data.data as Admin;
    },
  });
}
