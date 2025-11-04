import type { PaginationProps, User } from "../../utils/sharedTypes";
import type { Department } from "../departments/types";

export type InstructorsPaginated = PaginationProps & {
  data: Instructor[];
};

export type Instructor = {
  id: string;
  user: User;
  jobTitle: string;
  department: Pick<Department, "id" | "name" | "code">;
  isAdmin: boolean;
};
