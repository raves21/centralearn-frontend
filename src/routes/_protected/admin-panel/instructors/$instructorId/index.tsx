import InfoSection from "@/components/shared/infoPage/InfoSection";
import { useInstructorInfo } from "@/domains/instructors/api/queries";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/_protected/admin-panel/instructors/$instructorId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { instructorId } = Route.useParams();

  const { data: instructorInfo, status: instructorInfoStatus } =
    useInstructorInfo(instructorId);

  if ([instructorInfoStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if ([instructorInfoStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
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
              {
                label: "Is Admin",
                value: (
                  <p
                    className={cn(
                      "rounded-md px-2 py-1 text-white w-min text-xs",
                      instructorInfo.isAdmin ? "bg-green-500" : "bg-blue-500"
                    )}
                  >
                    {instructorInfo.isAdmin ? "Yes" : "No"}
                  </p>
                ),
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
