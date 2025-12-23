import ErrorComponent from "@/components/shared/ErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useInstructorInfo } from "@/domains/instructors/api/queries";
import { cn } from "@/lib/utils";
import type { NavigationButton } from "@/utils/sharedTypes";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
  useNavigate,
} from "@tanstack/react-router";
import { Pencil, Trash } from "lucide-react";

export const Route = createFileRoute(
  "/_protected/admin-panel/instructors/$instructorId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { instructorId } = Route.useParams();

  const matchRoute = useMatchRoute();
  const navigate = useNavigate();

  const tabRoutes: NavigationButton[] = [
    {
      name: "Profile",
      linkProps: {
        to: "/admin-panel/instructors/$instructorId",
        params: { studentId: instructorId },
      },
    },
    {
      name: "Classes",
      linkProps: {
        to: "/admin-panel/instructors/$instructorId/assigned-classes",
        params: { instructorId },
      },
    },
  ];

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
      <div className="flex flex-col gap-8 size-full">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/admin-panel/instructors">Instructors</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>View Instructor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="w-full flex flex-col">
          <div className="flex gap-5 w-full items-stretch">
            <div className="aspect-square rounded-xl overflow-hidden w-[160px] relative">
              <img
                className="size-full object-cover"
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Xxxtentacion_%28cropped%29.jpg"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="bg-blue-500 w-min text-white rounded-md py-1 px-2">
                Instructor
              </p>
              <p className="font-semibold text-4xl">
                {instructorInfo.user.firstName} {instructorInfo.user.lastName}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <button
                  onClick={() =>
                    navigate({
                      to: "/admin-panel/instructors/$instructorId/edit",
                      params: { instructorId },
                    })
                  }
                  className="flex items-center rounded-full gap-3 px-4 py-2 text-white bg-mainaccent"
                >
                  <Pencil className="size-4" />
                  <p>Update</p>
                </button>
                <button className="flex items-center rounded-full gap-3 px-4 py-2 text-white bg-red-500">
                  <Trash className="size-4" />
                  <p>Delete</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2 p-1 bg-gray-200 w-min rounded-lg">
            {tabRoutes.map((tabRoute) => (
              <Link
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
