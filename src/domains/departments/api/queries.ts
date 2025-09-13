import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import type { GetDepartmentsResponse } from "../types";

export function useDepartments({
  page = 1,
  searchQuery,
}: {
  page: number | undefined;
  searchQuery: string | undefined;
}) {
  return useQuery({
    queryKey: ["departments", page, searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/departments", {
        params: { page, query: searchQuery },
      });
      return data as GetDepartmentsResponse;
    },
  });
}
