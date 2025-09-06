import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import type { GetAllDepartmentsResponse } from "../types";

type UseDepartmentsArgs = {
  page: number | undefined;
  name: string | undefined;
};

export function useDepartments({ page = 1, name }: UseDepartmentsArgs) {
  return useQuery({
    queryKey: ["allDepartments", page, name || undefined],
    queryFn: async () => {
      const { data } = await api.get("/departments", { params: { name } });
      return data as GetAllDepartmentsResponse;
    },
  });
}
