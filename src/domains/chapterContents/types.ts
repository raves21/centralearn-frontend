import type { Chapter } from "../chapters/types";

export enum ContentType {
  Lecture = "App\\Models\\Lecture",
  Assessment = "App\\Models\\Assessment",
}

export type ChapterContent = {
  id: string;
  name: string;
  description: string | null;
  isOpen: boolean;
  opensAt: Date | null;
  closesAt: Date | null;
  chapter: Chapter
  isPublished: true;
  publishesAt: null;
  order: number;
  contentId: string;
  contentType: ContentType;
  content: {
    id: string;
  };
};
