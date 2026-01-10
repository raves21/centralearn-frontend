import { create } from "zustand";
import type { ChapterContent } from "@/domains/chapterContents/types";

interface ChapterReorderState {
  chapterContentsGlobalState: ChapterContent[];
  setChapterContentsGlobalState: (chapterContents: ChapterContent[]) => void;
}

export const useChapterContentReorderStore = create<ChapterReorderState>(
  (set) => ({
    chapterContentsGlobalState: [],
    setChapterContentsGlobalState: (chapterContents) =>
      set({ chapterContentsGlobalState: chapterContents }),
  })
);
