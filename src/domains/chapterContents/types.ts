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
  chapter: Chapter;
  isPublished: boolean;
  publishesAt: Date | null;
  order: number;
  contentId: string;
  contentType: ContentType;
  content: Assessment | { id: string };
};

export type Assessment = {
  id: string;
  timeLimit: number | null;
  maxAchievableScore: number;
  isAnswersViewableAfterSubmit: boolean;
  isScoreViewableAfterSubmit: boolean;
  isMultiAttempts: boolean;
  maxAttempts: number | null;
  multiAttemptGradingType: "avg_score" | "highest_score" | null;
  createdAt: Date;
  updatedAt: Date;
};
