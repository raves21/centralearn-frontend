import { useCourseClassInfo } from "@/domains/classes/api/queries";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { NavigationButton } from "@/utils/sharedTypes";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";

export const Route = createFileRoute("/_protected/lms/classes/$classId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId } = Route.useParams();

  const { data: courseClassInfo, status: courseClassInfoStatus } =
    useCourseClassInfo(classId);

  const matchRoute = useMatchRoute();

  const tabRoutes: NavigationButton[] = [
    {
      name: "Content",
      linkProps: {
        to: "/lms/classes/$classId",
        params: {
          classId,
        },
      },
    },
    {
      name: "Announcements",
      linkProps: {
        to: "/lms/classes/$classId/announcements",
        params: {
          classId,
        },
      },
    },
    {
      name: "Members",
      linkProps: {
        to: "/lms/classes/$classId/members",
        params: {
          classId,
        },
      },
    },
  ];

  if ([courseClassInfoStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([courseClassInfoStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (courseClassInfo) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <p className="text-xl text-gray-400 font-medium">
                {courseClassInfo.course.code} | {courseClassInfo.semester.name}{" "}
                | {courseClassInfo.section.name}
              </p>
              <p
                className={cn(
                  "px-2 py-1 rounded-full text-white",
                  courseClassInfo.status === "open"
                    ? "bg-green-500"
                    : "bg-red-500",
                )}
              >
                {courseClassInfo.status === "open" ? "Open" : "Closed"}
              </p>
            </div>
            <p className="text-2xl font-bold">{courseClassInfo.course.name}</p>
          </div>
        </div>
        <div className="relative w-full h-[180px] overflow-hidden rounded-lg">
          <img
            src={courseClassInfo.imageUrl}
            className="absolute size-full object-cover"
          />
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2 p-1 bg-gray-200 w-min rounded-lg">
            {tabRoutes.map((tabRoute, i) => (
              <Link
                key={i}
                {...tabRoute.linkProps}
                className={cn("px-3 py-2 rounded-md flex items-center gap-2", {
                  "bg-white": matchRoute({ to: tabRoute.linkProps.to }),
                })}
              >
                <p>{tabRoute.name}</p>
              </Link>
            ))}
          </div>
          <Outlet />
        </div>
      </div>
    );
  }
}
