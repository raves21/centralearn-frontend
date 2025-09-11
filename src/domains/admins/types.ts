import type { PaginationProps, User } from "../../utils/sharedTypes";

export type GetAdmins = PaginationProps & {
  data: Admin[];
};

export type Admin = {
  id: string;
  jobTitle: string;
  user: User;
};
