import InfoSection from "@/components/shared/infoPage/InfoSection";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";
import { useStudentInfo } from "@/domains/students/api/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/admin-panel/students/$studentId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { studentId } = Route.useParams();

  const { data: studentInfo, status: studentInfoStatus } =
    useStudentInfo(studentId);

  if ([studentInfoStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([studentInfoStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (studentInfo) {
    return (
      <div className="flex gap-6">
        <InfoSection
          className="flex-1"
          infoSection={{
            details: [
              {
                label: "First Name",
                value: studentInfo.user.firstName,
              },
              {
                label: "Last Name",
                value: studentInfo.user.lastName,
              },
              {
                label: "Email",
                value: studentInfo.user.email,
              },
              {
                label: "Address",
                value: studentInfo.user.address,
              },
            ],
            header: "Personal Information",
          }}
        />
        <InfoSection
          className="flex-1"
          infoSection={{
            details: [
              {
                label: "Program",
                value: `${studentInfo.program.name} (${studentInfo.program.code})`,
              },
              {
                label: "Department",
                value: `${studentInfo.program.department.name} (${studentInfo.program.department.code})`,
              },
            ],
            header: "Program Assignment",
          }}
        />
      </div>
    );
  }
}
