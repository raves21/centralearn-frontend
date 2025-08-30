export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
};

export type CurrentUser = User & {
  roles: string[];
  permissions: string[];
};
