import type { PaginationProps } from "@/utils/sharedTypes";

export type SectionsPaginated = PaginationProps & {
  data: Section[];
};

export type Section = {
  id: string;
  name: string;
};
