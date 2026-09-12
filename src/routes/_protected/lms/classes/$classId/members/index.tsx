import ShowErrorComponent from "@/components/shared/ErrorComponent";
import { DataTable } from "@/components/shared/listRecords/datatable/DataTable";
import ShowLoadingComponent from "@/components/shared/LoadingComponent";
import { useCourseClassMembers } from "@/domains/classes/api/queries";
import type { Instructor } from "@/domains/instructors/types";
import type { Student } from "@/domains/students/types";
import { useHandleSearchParamsValidationFailure } from "@/utils/hooks/useHandleSearchParamValidationFailure";
import type { SearchSchemaValidationStatus } from "@/utils/sharedTypes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const searchParamsSchema = z.object({
  searchQuery: z.string().optional(),
});

type SearchParamsSchema = z.infer<typeof searchParamsSchema> &
  SearchSchemaValidationStatus;

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId/members/",
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
  const { searchQuery, success } = Route.useSearch();
  useHandleSearchParamsValidationFailure({
    isValidationFail: !success,
    onValidationFail: () => navigate({ to: "/lms/dashboard" }),
  });
  const { classId } = Route.useParams();
  const { data, status } = useCourseClassMembers({
    id: classId,
    searchQuery,
  });
  const navigate = useNavigate();

  const instructorColumns: ColumnDef<Instructor>[] = [
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

  const studentColumns: ColumnDef<Student>[] = [
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
  ];

  if (status === "error") return <ShowErrorComponent />;
  if (status === "pending") return <ShowLoadingComponent />;
  if (data) {
    return (
      <div className="size-full flex flex-col gap-16 pt-8">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">Instructors</p>
          <DataTable columns={instructorColumns} data={data.instructors} />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">Students</p>
          <DataTable
            columns={studentColumns}
            data={data.students}
            filterProps={{
              searchInputPlaceholder: "Search students by name",
              searchInputInitValue: searchQuery,
              onInputSearch: (searchInput) =>
                navigate({
                  to: "/lms/classes/$classId/members",
                  params: {
                    classId,
                  },
                  search: (prev) => ({
                    ...prev,
                    searchQuery: searchInput || undefined,
                  }),
                }),
            }}
          />
        </div>
      </div>
    );
  }
}
