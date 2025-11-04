import type { PaginationProps, User } from "../../utils/sharedTypes";

export type AdminsPaginated = PaginationProps & {
  data: Admin[];
};

export type Admin = {
  id: string;
  jobTitle: string;
  user: User;
};
