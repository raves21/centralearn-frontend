import type { PaginationProps } from "../../utils/sharedTypes";
import type { Department } from "../departments/types";

export type GetCourses = PaginationProps & {
  data: Course[];
};

export type Course = {
  id: string;
  name: string;
  code: string;
  departments: Department[];
  imageUrl: string | null;
  description: string | null;
};
