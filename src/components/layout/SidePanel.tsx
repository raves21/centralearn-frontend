import {
  Calendar,
  Landmark,
  Clipboard,
  GraduationCap,
  BriefcaseBusiness,
  UserRoundCog,
  LayoutGrid,
  Layers,
  Component,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import type { NavigationButton } from "@/utils/sharedTypes";

export default function SidePanel() {
  const routesTemp: NavigationButton[] = [
    {
      name: "Dashboard",
      linkProps: {
        to: "/admin-panel/dashboard",
      },
      icon: <LayoutGrid key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Semesters",
      linkProps: {
        to: "/admin-panel/semesters",
      },
      icon: <Calendar key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Departments",
      linkProps: {
        to: "/admin-panel/departments",
      },
      icon: <Landmark key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Programs",
      linkProps: {
        to: "/admin-panel/programs",
      },
      icon: <Layers key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Courses",
      linkProps: {
        to: "/admin-panel/courses",
      },
      icon: <Layers key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Classes",
      linkProps: {
        to: "/admin-panel/classes",
      },
      icon: <Clipboard key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Sections",
      linkProps: {
        to: "/admin-panel/sections",
      },
      icon: <Component key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Admins",
      linkProps: {
        to: "/admin-panel/admins",
      },
      icon: <UserRoundCog key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Students",
      linkProps: {
        to: "/admin-panel/students",
      },
      icon: <GraduationCap key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Instructors",
      linkProps: {
        to: "/admin-panel/instructors",
      },
      icon: <BriefcaseBusiness key={crypto.randomUUID()} className="size-6" />,
    },
  ];

  const matchRoute = useMatchRoute();

  return (
    <div className="flex flex-col fixed left-0 top-[9dvh] pt-[28px] px-2 w-[30%] max-w-[300px] h-[calc(100dvh-9dvh)] overflow-auto bg-main-bg">
      {routesTemp.map((route) => (
        <Link
          {...route.linkProps}
          key={route.name}
          className={cn(
            "p-3 flex items-center w-full text-main-text gap-[10px] rounded-md font-medium",
            {
              "bg-mainaccent text-white": !!matchRoute({
                to: route.linkProps.to,
                fuzzy: true,
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
