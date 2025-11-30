import { api } from "@/utils/axiosBackend";
import { useQuery } from "@tanstack/react-query";
import type { ChapterContent } from "../types";


export function useChapterContentInfo(chapterContentId: string){
    return useQuery({
        queryKey: ["chapterContent", chapterContentId],
        queryFn: async () => {
            const { data } = await api.get(`/contents/${chapterContentId}`);
            return data.data as ChapterContent;
        },
    });
}