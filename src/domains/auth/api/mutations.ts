import { useMutation } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import axios from "axios";
import type { CurrentUser } from "../types";
import { queryClient } from "../../../utils/queryClient";
import { setCurrentUser } from "../functions";
import { Role } from "@/utils/sharedTypes";

type UseLoginArgs = {
  email: string;
  password: string;
};
export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: UseLoginArgs) => {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/sanctum/csrf-cookie`);
      const { data } = await api.post("/auth/login", { email, password });
      return data.data as CurrentUser;
    },
    onSuccess: (data) => {
      const currentUser = data;
      queryClient.clear();
      setCurrentUser(currentUser);
      if ([Role.ADMIN, Role.SUPERADMIN].includes(currentUser.roles[0])) {
        history.replaceState(null, "", "/admin-panel/dashboard");
      } else {
        history.replaceState(null, "", "/lms/dashboard");
      }
    },
  });
}
