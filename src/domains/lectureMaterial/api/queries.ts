import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { LectureMaterial } from "../types";


export function useLectureAllMaterials(lectureId: string | undefined){
    return useQuery({
        queryKey: ["lectureMaterials", lectureId],
        queryFn: async () => {
            const {data} = await api.get('/lecture-materials', {params: {lecture_id: lectureId, paginate: false}})
            
            return data.data as LectureMaterial[]
        },
        enabled: !!lectureId
    })
}