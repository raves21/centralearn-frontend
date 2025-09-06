import type { User } from "../../utils/sharedTypes";

export type CurrentUser = User & {
  roles: string[];
  permissions: string[];
};
