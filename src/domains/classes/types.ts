import type { PaginationProps } from "../../utils/sharedTypes";
import type { Course } from "../courses/types";
import type { Section } from "../sections/types";
import type { Semester } from "../semesters/types";

export type CourseClassesPaginated = PaginationProps & {
  data: CourseClass[];
};

export type CourseClass = {
  id: string;
  course: Course;
  semester: Semester;
  section: Section;
  status: "open" | "close";
  imageUrl: string;
};
