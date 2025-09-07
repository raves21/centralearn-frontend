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
      icon: <LayoutGrid key={1} className="size-6" />,
    },
    {
      name: "Departments",
      linkProps: {
        to: "/departments",
      },
      icon: <Landmark key={2} className="size-6" />,
    },
    {
      name: "Semesters",
      linkProps: {
        to: "/semesters",
      },
      icon: <Calendar key={3} className="size-6" />,
    },
    {
      name: "Courses",
      linkProps: {
        to: "/courses",
      },
      icon: <Layers key={4} className="size-6" />,
    },
    {
      name: "Classes",
      linkProps: {
        to: "/classes",
      },
      icon: <Clipboard key={5} className="size-6" />,
    },
    {
      name: "Admins",
      linkProps: {
        to: "/admins",
      },
      icon: <UserRoundCog key={6} className="size-6" />,
    },
    {
      name: "Students",
      linkProps: {
        to: "/students",
      },
      icon: <GraduationCap key={7} className="size-6" />,
    },
    {
      name: "Instructors",
      linkProps: {
        to: "/instructors",
      },
      icon: <BriefcaseBusiness key={8} className="size-6" />,
    },
  ];

  const matchRoute = useMatchRoute();

  return (
    <div className="flex flex-col p-2 w-[16%] h-full pt-[calc(9dvh+20px)] bg-main-bg">
      {routesTemp.map((route) => (
        <Link
          {...route.linkProps}
          key={route.name}
          className={cn(
            "p-3 flex items-center w-full text-main-text gap-[10px] rounded-md font-medium",
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
