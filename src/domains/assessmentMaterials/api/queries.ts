import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { AssessmentMaterial } from "../types";

export function useAllAssessmentMaterials({
  assessmentId,
}: {
  assessmentId: string;
}) {
  return useQuery({
    queryKey: ["assessmentMaterials", assessmentId],
    queryFn: async () => {
      const { data } = await api.get("/assessment-materials", {
        params: { assessment_id: assessmentId, paginate: false },
      });

      return data.data as AssessmentMaterial[];
    },
  });
}
