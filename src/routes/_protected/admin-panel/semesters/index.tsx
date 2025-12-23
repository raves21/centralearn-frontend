import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import TitleAndCreateAction from "@/components/shared/listRecords/TitleAndCreateAction";
import { useSemesters } from "@/domains/semesters/api/queries";
import type { Semester } from "@/domains/semesters/types";
import dayjs from "dayjs";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";

const searchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamsSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute("/_protected/admin-panel/semesters/")({
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
    onValidationFail: () => navigate({ to: "/admin-panel/semesters" }),
  });

  const { data, status } = useSemesters({ page, searchQuery });

  const columns: ColumnDef<Semester>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: (data) => dayjs(data.getValue() as string).format("MMM D, YYYY"),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: (data) => dayjs(data.getValue() as string).format("MMM D, YYYY"),
    },
  ];

  if (status === "error") {
    return <ErrorComponent />;
  }

  if (status === "pending") {
    return <LoadingComponent />;
  }

  if (data) {
    return (
      <div className="size-full flex flex-col gap-16">
        <TitleAndCreateAction
          headerTitle="Semesters"
          createAction={() => navigate({ to: "/admin-panel/semesters/create" })}
        />
        <DataTable
          columns={columns}
          data={data.data}
          paginationProps={{
            currentPage: data.meta.current_page,
            handlePageChange: (_, page) => {
              navigate({
                to: "/admin-panel/semesters",
                search: (prev) => ({ ...prev, page: page }),
              });
            },
            totalPages: data.meta.last_page,
          }}
          filterProps={{
            searchInputPlaceholder: "Search semesters by name",
            searchInputInitValue: searchQuery,
            onInputSearch: (searchInput) =>
              navigate({
                to: "/admin-panel/semesters",
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
