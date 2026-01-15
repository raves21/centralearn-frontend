import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { AssessmentMaterial } from "../types";

export function useAllAssessmentMaterials({  assessmentId }: { assessmentId: string }) {
  return useQuery({
    queryKey: ["lectureMaterials", assessmentId],
    queryFn: async () => {
      const { data } = await api.get("/lecture-materials", {
        params: { lecture_id: assessmentId, paginate: false },
      });

      return data.data as AssessmentMaterial[];
    },
  });
}