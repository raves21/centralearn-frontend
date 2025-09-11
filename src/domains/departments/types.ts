import type { PaginationProps } from "../../utils/sharedTypes";

export type GetDepartmentsResponse = PaginationProps & {
  data: Department[];
};

export type Department = {
  id: string;
  name: string;
  code: string;
  description: null;
  imageUrl: null;
};
