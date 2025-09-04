import {
  Calendar,
  Landmark,
  Clipboard,
  GraduationCap,
  BriefcaseBusiness,
  UserRoundCog,
  LayoutGrid,
  Layers,
} from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Link, useMatchRoute, type LinkProps } from "@tanstack/react-router";

type SidePanelRoute = {
  name: string;
  linkProps: LinkProps;
  icon: ReactNode;
};

export default function SidePanel() {
  const routesTemp: SidePanelRoute[] = [
    {
      name: "Dashboard",
      linkProps: {
        to: "/dashboard",
      },
      icon: <LayoutGrid className="size-6" />,
    },
    {
      name: "Departments",
      linkProps: {
        to: "/departments",
      },
      icon: <Landmark className="size-6" />,
    },
    {
      name: "Semesters",
      linkProps: {
        to: "/semesters",
      },
      icon: <Calendar className="size-6" />,
    },
    {
      name: "Courses",
      linkProps: {
        to: "/courses",
      },
      icon: <Layers className="size-6" />,
    },
    {
      name: "Classes",
      linkProps: {
        to: "/classes",
      },
      icon: <Clipboard className="size-6" />,
    },
    {
      name: "Admins",
      linkProps: {
        to: "/admins",
      },
      icon: <UserRoundCog className="size-6" />,
    },
    {
      name: "Students",
      linkProps: {
        to: "/students",
      },
      icon: <GraduationCap className="size-6" />,
    },
    {
      name: "Instructors",
      linkProps: {
        to: "/instructors",
      },
      icon: <BriefcaseBusiness className="size-6" />,
    },
  ];

  const matchRoute = useMatchRoute();

  return (
    <div className="flex flex-col p-2 w-[16%] h-full pt-[calc(9dvh+20px)] bg-main-bg">
      {routesTemp.map((route, i) => (
        <Link
          {...route.linkProps}
          key={i}
          className={cn(
            "p-3 flex items-center w-full text-gray-500 gap-[10px] rounded-md font-medium",
            {
              "bg-mainaccent text-white": !!matchRoute({
                to: route.linkProps.to,
              }),
            }
          )}
        >
          {route.icon}
          {route.name}
        </Link>
      ))}
    </div>
  );
}
