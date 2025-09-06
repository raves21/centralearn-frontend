import type { PaginationProps } from "../../utils/sharedTypes";

export type GetAllDepartmentsResponse = PaginationProps & {
  data: Department[];
};

export type Department = {
  id: string;
  name: string;
  code: string;
  description: null;
  imageUrl: null;
};
