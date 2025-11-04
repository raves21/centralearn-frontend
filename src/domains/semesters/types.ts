import type { PaginationProps } from "../../utils/sharedTypes";

export type SemestersPaginated = PaginationProps & {
  data: Semester[];
};

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type SemesterMinMaxTimestamps = {
  startDateMin: string | null;
  endDateMax: string | null;
};
