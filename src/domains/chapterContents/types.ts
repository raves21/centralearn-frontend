import type { Chapter } from "../chapters/types";

export enum ContentType {
  Lecture = "App\\Models\\Lecture",
  Assessment = "App\\Models\\Assessment",
}

export type ChapterContent = {
  id: string;
  name: string;
  description: string | null;
  accessibilitySettings: {
    visible: boolean | null;
    custom: {
      access_from: string;
      access_until: string | null;
    } | null;
  } | null;
  isAccessible: boolean;
  chapter: Chapter;
  order: number;
  contentId: string;
  contentType: ContentType;
  content: Assessment | { id: string };
};

export type Assessment = {
  id: string;
  submissionSettings: {
    time_limit_seconds: number | null;
    due_date: string | null;
    after_due_date_behavior: "auto_submit" | "block_new_attempts" | "allow_all" | null;
  } | null;
  maxAchievableScore: number;
  isAnswersViewableAfterSubmit: boolean;
  isScoreViewableAfterSubmit: boolean;
  maxAttempts: number | null;
  multiAttemptGradingType: "avg_score" | "highest_score" | null;
  createdAt: Date;
  updatedAt: Date;
};
