import type { PaginationProps } from "../../utils/sharedTypes";

export type DepartmentsPaginated = PaginationProps & {
  data: Department[];
};

export type Department = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  imageUrl: string | null;
};
