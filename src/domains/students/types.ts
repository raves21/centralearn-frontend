import type { PaginationProps, User } from "../../utils/sharedTypes";
import type { Program } from "../programs/types";

export type GetAllStudentsResponse = PaginationProps & {
  data: Student[];
};

export type Student = {
  id: string;
  user: User;
  program: Pick<Program, "id" | "name" | "code" | "department">;
};
