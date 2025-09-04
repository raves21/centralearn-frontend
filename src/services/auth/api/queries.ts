import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/axiosBackend";
import type { CurrentUser } from "../types";
import { neverRefetchSettings } from "../../../utils/queryClient";
import axios from "axios";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // const { data: z } = await axios.get(
      //   "http://localhost:8000/api/feedback-questions"
      //   //   {
      //   //   headers: {
      //   //     Accept: "application/json",
      //   //   },
      //   // }
      // );
      // console.log("Z", z);
      const { data } = await api.get("/auth/me");
      console.log("DATA", data);
      return data.data as CurrentUser;
    },
    ...neverRefetchSettings,
  });
}
