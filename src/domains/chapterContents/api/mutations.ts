import { api } from "@/utils/axiosBackend";
import { useMutation } from "@tanstack/react-query";


export function useCreateLectureContent(){
    return useMutation({
        mutationFn: async (formData: FormData) => {
            await api.post("/lecture-materials", formData)
        },
    });
}

export function useBulkCreateLectureContent(){
    return useMutation({
        mutationFn: async (formData: FormData) => {
            await api.post("/lecture-materials/bulk", formData)
        },
    });
}