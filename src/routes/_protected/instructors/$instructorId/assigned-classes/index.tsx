import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import TitleAndCreateAction from "@/components/shared/listRecords/TitleAndCreateAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CourseClass } from "@/domains/classes/types";
import type { Course } from "@/domains/courses/types";
import { useInstructorAssignedClasses } from "@/domains/instructors/api/queries";
import type { Section } from "@/domains/sections/types";
import type { Semester } from "@/domains/semesters/types";
import { cn } from "@/lib/utils";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Loader, Trash } from "lucide-react";
import z from "zod";

const searchParamSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute(
  "/_protected/instructors/$instructorId/assigned-classes/"
)({
  component: RouteComponent,
  validateSearch: (search): SearchParamsSchema => {
    const validated = searchParamSchema.safeParse(search);
    if (validated.success) {
      return { ...search, success: true };
    }
    return {
      success: false,
    };
  },
});

function RouteComponent() {
  const { instructorId } = Route.useParams();
  const navigate = useNavigate();
  const { page, searchQuery, success } = Route.useSearch();

  useHandleSearchParamsValidationFailure({
    isValidationFail: !success,
    onValidationFail: () =>
      navigate({ to: "/instructors/$instructorId", params: { instructorId } }),
  });

  const { data: assignedClasses, status: assignedClassesStatus } =
    useInstructorAssignedClasses({
      instructorId,
      page,
      searchQuery,
    });

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
        return semester.name;
      },
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: ({ getValue }) => {
        const section = getValue<Section>();
        return section.name;
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
      cell: () => {
        // const rowClass = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="stroke-mainaccent" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem>
                Unassign
                <Trash className="stroke-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if ([assignedClassesStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if ([assignedClassesStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (assignedClasses) {
    return (
      <div className="size-full flex flex-col gap-16">
        <TitleAndCreateAction
          headerTitle="Assigned Classes"
          createAction={() =>
            navigate({
              to: "/instructors/$instructorId/assign-to-class",
              params: { instructorId },
            })
          }
          createActionLabel="Assign to Class"
        />
        <DataTable
          columns={columns}
          data={assignedClasses.data}
          paginationProps={{
            currentPage: assignedClasses.meta.current_page,
            handlePageChange: (_, page) => {
              navigate({
                to: "/instructors/$instructorId/assigned-classes",
                params: { instructorId },
                search: (prev) => ({ ...prev, page: page }),
              });
            },
            totalPages: assignedClasses.meta.last_page,
          }}
          filterProps={{
            searchInputPlaceholder: "Search classes by name/code",
            searchInputInitValue: searchQuery,
            onInputSearch: (searchInput) =>
              navigate({
                to: "/instructors/$instructorId/assigned-classes",
                params: { instructorId },
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
