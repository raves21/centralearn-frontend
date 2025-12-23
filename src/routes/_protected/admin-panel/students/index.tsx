import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import TitleAndCreateAction from "@/components/shared/listRecords/TitleAndCreateAction";
import { useStudents } from "@/domains/students/api/queries";
import type { Student } from "@/domains/students/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";

const searchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamsSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute("/_protected/admin-panel/students/")({
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
    onValidationFail: () => navigate({ to: "/admin-panel/students" }),
  });

  const { data, status } = useStudents({ page, searchQuery });

  const columns: ColumnDef<Student>[] = [
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
      accessorFn: (row) => row.program.code,
      accessorKey: "programCode",
      header: "Program",
    },
    {
      accessorFn: (row) => row.program.department.code,
      accessorKey: "programDept",
      header: "Department",
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const student = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="stroke-mainaccent" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/admin-panel/students/$studentId/edit",
                    params: {
                      studentId: student.id,
                    },
                  })
                }
              >
                Edit
                <Pencil className="stroke-mainaccent" />
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete
                <Trash className="stroke-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
          headerTitle="Students"
          createAction={() => navigate({ to: "/admin-panel/students/create" })}
        />
        <DataTable
          columns={columns}
          data={data.data}
          onRowClick={(row) =>
            navigate({
              to: "/admin-panel/students/$studentId",
              params: {
                studentId: row.id,
              },
            })
          }
          paginationProps={{
            currentPage: data.meta.current_page,
            handlePageChange: (_, page) => {
              navigate({
                to: "/admin-panel/students",
                search: (prev) => ({ ...prev, page: page }),
              });
            },
            totalPages: data.meta.last_page,
          }}
          filterProps={{
            searchInputPlaceholder: "Search students by name",
            searchInputInitValue: searchQuery,
            onInputSearch: (searchInput) =>
              navigate({
                to: "/admin-panel/students",
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
