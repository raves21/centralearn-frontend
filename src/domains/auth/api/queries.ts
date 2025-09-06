import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import type { CurrentUser } from "../types";
import { neverRefetchSettings } from "../../../utils/queryClient";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.data as CurrentUser;
    },
    ...neverRefetchSettings,
  });
}
