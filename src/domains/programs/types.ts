import type { PaginationProps } from "../../utils/sharedTypes";
import type { Department } from "../departments/types";

export type GetAllProgramsResponse = PaginationProps & {
  data: Program[];
};

export type Program = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  imageUrl: string | null;
  department: Pick<Department, "id" | "name" | "code"> | null;
};
