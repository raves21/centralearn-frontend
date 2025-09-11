import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axiosBackend";
import type { GetAdmins } from "../types";

type UseAdminsArgs = {
  searchQuery: string | undefined;
  page: number | undefined;
};

export function useAdmins({ page, searchQuery }: UseAdminsArgs) {
  return useQuery({
    queryKey: ["admins", page, searchQuery],
    queryFn: async () => {
      const { data } = await api.get("/admins", {
        params: { page, query: searchQuery },
      });
      return data as GetAdmins;
    },
  });
}
