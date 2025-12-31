import type { ChapterContent } from "../chapterContents/types";

export type Chapter = {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  published_at: string | null;
  contents: ChapterContent[];
};
