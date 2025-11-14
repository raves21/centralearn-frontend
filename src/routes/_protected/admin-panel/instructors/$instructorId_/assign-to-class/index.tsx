import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import { Check, Loader } from "lucide-react";
import { useInstructorAssignableClasses } from "@/domains/instructors/api/queries";
import { cn } from "@/lib/utils";
import type { Section } from "@/domains/sections/types";
import type { Semester } from "@/domains/semesters/types";
import type { Course } from "@/domains/courses/types";
import type { CourseClass } from "@/domains/classes/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAssignInstructorToClass } from "@/domains/instructors/api/mutations";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { toast } from "sonner";

const searchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamsSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute(
  "/_protected/admin-panel/instructors/$instructorId_/assign-to-class/"
)({
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
  const { instructorId } = Route.useParams();
  const { searchQuery, page, success } = Route.useSearch();
  const navigate = useNavigate();
  useHandleSearchParamsValidationFailure({
    isValidationFail: !success,
    onValidationFail: () =>
      navigate({
        to: "/admin-panel/instructors/$instructorId",
        params: { instructorId },
      }),
  });

  const { data, status } = useInstructorAssignableClasses({
    instructorId,
    page,
    searchQuery,
  });

  const { mutateAsync: assignToClass, status: assignToClassStatus } =
    useAssignInstructorToClass();

  usePendingOverlay({
    isPending: assignToClassStatus === "pending",
    pendingLabel: "Assigning to Class",
  });

  async function selectClass(classId: string) {
    try {
      await assignToClass({ instructorId, classId });
      navigate({
        to: "/admin-panel/instructors/$instructorId/assigned-classes",
        params: { instructorId },
      });
    } catch (error) {
      toast.error("An error occured.");
    }
  }

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
        const courseClass = row.original;
        return (
          <button
            onClick={() => selectClass(courseClass.id)}
            className="flex items-center gap-2 hover:bg-mainaccent-disabled px-3 py-2 rounded-md bg-mainaccent text-white"
          >
            <Check className="stroke-white size-5" />
            <p>Select</p>
          </button>
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
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/admin-panel/instructors">Instructors</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  to="/admin-panel/instructors/$instructorId/assigned-classes"
                  params={{
                    instructorId,
                  }}
                >
                  View Instructor
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Enroll to Class</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <p className="text-2xl font-bold">Select a Class</p>
        <DataTable
          columns={columns}
          data={data.data}
          paginationProps={{
            currentPage: data.meta.current_page,
            handlePageChange: (_, page) => {
              navigate({
                to: "/admin-panel/instructors/$instructorId/assign-to-class",
                params: { instructorId },
                search: (prev) => ({ ...prev, page: page }),
              });
            },
            totalPages: data.meta.last_page,
          }}
          filterProps={{
            searchInputPlaceholder: "Search classes by name",
            searchInputInitValue: searchQuery,
            onInputSearch: (searchInput) =>
              navigate({
                to: "/admin-panel/instructors/$instructorId/assign-to-class",
                params: { instructorId },
                search: (prev) => ({
                  ...prev,
                  searchQuery: searchInput || undefined,
                }),
              }),
          }}
          noResultsMessage="No enrollable classes yet."
        />
      </div>
    );
  }
}
