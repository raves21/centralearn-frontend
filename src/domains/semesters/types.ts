import type { PaginationProps } from "../../utils/sharedTypes";

export type GetAllSemestersResponse = PaginationProps & {
  data: Semester[];
};

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};
