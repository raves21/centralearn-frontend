import { useMutation } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import axios from "axios";
import type { CurrentUser } from "../types";
import { queryClient } from "../../../utils/queryClient";
import { setCurrentUser } from "../functions";

type UseLogin = {
  email: string;
  password: string;
};
export function useLogin({ email, password }: UseLogin) {
  return useMutation({
    mutationFn: async () => {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/sanctum/csrf-cookie`);
      const { data } = await api.post("/auth/login", { email, password });
      return data.data as CurrentUser;
    },
    onSuccess: (data) => {
      queryClient.clear();
      setCurrentUser(data);
      history.replaceState(null, "", "/home");
    },
  });
}
