import type { User } from "../../utils/sharedTypes";

export type CurrentUser = User & {
  permissions: string[];
};
