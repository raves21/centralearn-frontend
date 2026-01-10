import { create } from "zustand";
import type { Chapter } from "../types";

interface ChapterReorderState {
  chaptersGlobalState: Chapter[];
  setChaptersGlobalState: (chapters: Chapter[]) => void;
}

export const useChapterReorderStore = create<ChapterReorderState>((set) => ({
  chaptersGlobalState: [],
  setChaptersGlobalState: (chapters) => set({ chaptersGlobalState: chapters }),
}));
