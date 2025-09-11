import type { PaginationProps } from "../../utils/sharedTypes";

export type GetCourses = PaginationProps & {
  data: Course[];
};

export type Course = {
  id: string;
  name: string;
  code: string;
  departments: string[];
  imageUrl: string | null;
  description: string | null;
};
