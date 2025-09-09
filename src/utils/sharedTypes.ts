export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  roles: string[];
};

export type PaginationProps = {
  links: PaginationLinks;
  meta: PaginationMeta;
};

export type PaginationLinks = {
  first: string;
  last: string;
  prev: null;
  next: null;
};

export type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
};

export type PaginationLink = {
  url: null | string;
  label: string;
  active: boolean;
};

export type SearchSchemaValidationStatus = {
  success?: boolean;
};
