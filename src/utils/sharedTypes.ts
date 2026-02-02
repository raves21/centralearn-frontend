import type { LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

export enum Role {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
  STUDENT = "student",
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  roles: Role[];
  instructorId?: string;
  studentId?: string;
  adminId?: string;
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

export type PaginatedQueryParams = {
  page?: number | undefined;
  searchQuery?: string | undefined;
  filters?: Record<string, any>;
};

export type SearchSchemaValidationStatus = {
  success?: boolean;
};

export type NavigationButton = {
  name: string;
  linkProps: LinkProps;
  icon?: ReactNode;
};

export type InfoSectionDetail = {
  label: string;
  value: string | ReactNode;
};

export type TInfoSection = {
  header: string;
  details: InfoSectionDetail[];
};

export type TextAttachment = {
  id: string;
  content: string;
};

export type FileAttachment = {
  id: string;
  path: string;
  url: string;
  mime: string;
  extension: string;
  type: "image" | "video" | "document";
  name: string;
  size: number;
};

export type TiptapSelector =
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "bulletList"
  | "orderedList"
  | "codeBlock"
  | "blockquote"
  | "undo"
  | "redo"
  | "eraser"
  | "removeFormatting";
