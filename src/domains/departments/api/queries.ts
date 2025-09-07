import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import type { GetAllDepartmentsResponse } from "../types";

type UseDepartmentsArgs = {
  page: number | undefined;
  searchQuery: string | undefined;
};

export function useDepartments({ page = 1, searchQuery }: UseDepartmentsArgs) {
  return useQuery({
    queryKey: ["allDepartments", page, searchQuery || undefined],
    queryFn: async () => {
      const { data } = await api.get("/departments", {
        params: { page, query: searchQuery },
      });
      return data as GetAllDepartmentsResponse;
    },
  });
}
