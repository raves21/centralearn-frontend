import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";

export function useCreateSemester() {
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      startDate: Date;
      endDate: Date;
    }) => {
      await api.post("/semesters", {
        ...payload,
        start_date: dayjs(payload.startDate).format("YYYY-MM-DD"),
        end_date: dayjs(payload.endDate).format("YYYY-MM-DD"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}
