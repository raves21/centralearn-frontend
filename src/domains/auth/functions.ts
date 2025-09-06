import { queryClient } from "../../utils/queryClient";
import type { CurrentUser } from "./types";

export function setCurrentUser(user: CurrentUser) {
  queryClient.setQueryData<CurrentUser | undefined | null>(
    ["currentUser"],
    user
  );
}

export function getCurrentUser() {
  return queryClient.getQueryData<CurrentUser | undefined | null>([
    "currentUser",
  ]);
}
