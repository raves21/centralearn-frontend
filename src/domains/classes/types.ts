import type { PaginationProps } from "../../utils/sharedTypes";
import type { Course } from "../courses/types";
import type { Semester } from "../semesters/types";

export type GetAllCourseClasses = PaginationProps & {
  data: CourseClass[];
};

export type CourseClass = {
  id: string;
  name: string;
  course: Course;
  semester: Semester;
  status: string;
};
