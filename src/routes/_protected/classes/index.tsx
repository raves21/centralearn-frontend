import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import { EllipsisVertical, Loader, Pencil, Trash } from "lucide-react";
import TitleAndCreateAction from "@/components/shared/listRecords/TitleAndCreateAction";
import type { Course } from "@/domains/courses/types";
import { useCourseClasses } from "@/domains/classes/api/queries";
import type { CourseClass } from "@/domains/classes/types";
import type { Semester } from "@/domains/semesters/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Section } from "@/domains/sections/types";

const searchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamsSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute("/_protected/classes/")({
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
    onValidationFail: () => navigate({ to: "/classes" }),
  });

  const { data, status } = useCourseClasses({ page, searchQuery });

  const columns: ColumnDef<CourseClass>[] = [
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ getValue }) => {
        const course = getValue<Course>();
        return <p>{course.name}</p>;
      },
    },
    {
      accessorKey: "courseCode",
      header: "Course Code",
      cell: ({ row }) => {
        const courseClass = row.original;
        return <p>{courseClass.course.code}</p>;
      },
    },
    {
      accessorKey: "semester",
      header: "Semester",
      cell: ({ getValue }) => {
        const semester = getValue<Semester>();
        return <p>{semester.name}</p>;
      },
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: ({ getValue }) => {
        const section = getValue<Section>();
        return <p>{section.name}</p>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<"open" | "close">();
        return (
          <p
            className={cn(
              "rounded-md px-2 py-1 text-white w-min text-xs",
              status === "open" ? "bg-green-500" : "bg-red-600"
            )}
          >
            {status.split("")[0].toUpperCase() + status.substring(1)}
          </p>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const rowClass = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="stroke-mainaccent" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/classes/$classId/edit",
                    params: {
                      classId: rowClass.id,
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
          headerTitle="Classes"
          createAction={() => navigate({ to: "/classes/create" })}
        />
        <DataTable
          columns={columns}
          data={data.data}
          paginationProps={{
            currentPage: data.meta.current_page,
            handlePageChange: (_, page) => {
              navigate({
                to: "/classes",
                search: (prev) => ({ ...prev, page: page }),
              });
            },
            totalPages: data.meta.last_page,
          }}
          filterProps={{
            searchInputPlaceholder: "Search classes by section name",
            searchInputInitValue: searchQuery,
            onInputSearch: (searchInput) =>
              navigate({
                to: "/classes",
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
