import ErrorComponent from "@/components/shared/ErrorComponent";
import InfoSection from "@/components/shared/infoPage/InfoSection";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { useInstructorInfo } from "@/domains/instructors/api/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/admin-panel/instructors/$instructorId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { instructorId } = Route.useParams();

  const { data: instructorInfo, status: instructorInfoStatus } =
    useInstructorInfo(instructorId);

  if ([instructorInfoStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([instructorInfoStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (instructorInfo) {
    return (
      <div className="flex gap-6">
        <InfoSection
          className="flex-1"
          infoSection={{
            details: [
              {
                label: "First Name",
                value: instructorInfo.user.firstName,
              },
              {
                label: "Last Name",
                value: instructorInfo.user.lastName,
              },
              {
                label: "Email",
                value: instructorInfo.user.email,
              },
              {
                label: "Address",
                value: instructorInfo.user.address,
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
                label: "Department",
                value: `${instructorInfo.department.name} (${instructorInfo.department.code})`,
              },
            ],
            header: "Department Assignment",
          }}
        />
      </div>
    );
  }
}
