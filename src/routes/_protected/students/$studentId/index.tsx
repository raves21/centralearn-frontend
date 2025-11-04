import InfoSection from "@/components/shared/infoPage/InfoSection";
import { useStudentInfo } from "@/domains/students/api/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/_protected/students/$studentId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { studentId } = Route.useParams();

  const { data: studentInfo, status: studentInfoStatus } =
    useStudentInfo(studentId);

  if ([studentInfoStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if ([studentInfoStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
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
