import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import { Loader } from "lucide-react";
import TitleAndCreateAction from "@/components/shared/listRecords/TitleAndCreateAction";
import { useInstructors } from "@/domains/instructors/api/queries";
import type { Instructor } from "@/domains/instructors/types";

const searchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamsSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute("/_protected/instructors/")({
  component: RouteComponent,
  validateSearch: (search): SearchParamsSchema => {
    const validated = searchParamsSchema.safeParse(search);
    if (validated.success) {
      return { ...search, success: true };
    }
    return {
      success: false,
    };
  },
});

function RouteComponent() {
  const { searchQuery, page, success } = Route.useSearch();
  const navigate = useNavigate();
  useHandleSearchParamsValidationFailure({
    isValidationFail: !success,
    onValidationFail: () => navigate({ to: "/instructors" }),
  });

  const { data, status } = useInstructors({ page, searchQuery });

  const columns: ColumnDef<Instructor>[] = [
    {
      accessorFn: (row) => row.user.firstName,
      accessorKey: "firstName",
      header: "Firstname",
    },
    {
      accessorFn: (row) => row.user.lastName,
      accessorKey: "lastName",
      header: "Lastname",
    },
    {
      accessorFn: (row) => row.department.code,
      accessorKey: "programCode",
      header: "Program",
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
    },
  ];

  if (status === "error") {
    return (
      <div className="size-full grid place-items-center">
        <p className="text-xl font-medium">An error occured.</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (data) {
    return (
      <div className="size-full flex flex-col gap-16">
        <TitleAndCreateAction
          headerTitle="Instructors"
          createAction={() => {}}
        />
        <DataTable
          columns={columns}
          data={data.data}
          paginationProps={{
            currentPage: data.meta.current_page,
            handlePageChange: (_, page) => {
              navigate({
                to: "/instructors",
                search: (prev) => ({ ...prev, page: page }),
              });
            },
            totalPages: data.meta.last_page,
          }}
          filterProps={{
            searchInputPlaceholder: "Search instructors by name",
            searchInputInitValue: searchQuery,
            onInputSearch: (searchInput) =>
              navigate({
                to: "/instructors",
                search: (prev) => ({
                  ...prev,
                  searchQuery: searchInput || undefined,
                }),
              }),
          }}
        />
      </div>
    );
  }
}
