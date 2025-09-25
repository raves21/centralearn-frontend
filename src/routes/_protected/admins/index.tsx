import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import { Loader } from "lucide-react";
import TitleAndCreateAction from "@/components/shared/listRecords/TitleAndCreateAction";
import { useAdmins } from "@/domains/admins/api/queries";
import type { Admin } from "@/domains/admins/types";

const searchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamsSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute("/_protected/admins/")({
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
    onValidationFail: () => navigate({ to: "/admins" }),
  });

  const { data, status } = useAdmins({ page, searchQuery });

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "jobTitle",
      header: "Job Title",
    },
    {
      accessorFn: (row) => row.user.firstName,
      id: "firstName",
      header: "First Name",
    },
    {
      accessorFn: (row) => row.user.lastName,
      id: "lastName",
      header: "Last Name",
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
          headerTitle="Admins"
          createAction={() => navigate({ to: "/admins/create" })}
        />
        <DataTable
          columns={columns}
          data={data.data}
          paginationProps={{
            currentPage: data.meta.current_page,
            handlePageChange: (_, page) => {
              navigate({
                to: "/admins",
                search: (prev) => ({ ...prev, page: page }),
              });
            },
            totalPages: data.meta.last_page,
          }}
          filterProps={{
            searchInputPlaceholder: "Search admins by section name",
            searchInputInitValue: searchQuery,
            onInputSearch: (searchInput) =>
              navigate({
                to: "/admins",
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
