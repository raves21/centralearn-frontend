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
      icon: <LayoutGrid key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Semesters",
      linkProps: {
        to: "/semesters",
      },
      icon: <Calendar key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Departments",
      linkProps: {
        to: "/departments",
      },
      icon: <Landmark key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Programs",
      linkProps: {
        to: "/programs",
      },
      icon: <Layers key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Courses",
      linkProps: {
        to: "/courses",
      },
      icon: <Layers key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Classes",
      linkProps: {
        to: "/classes",
      },
      icon: <Clipboard key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Admins",
      linkProps: {
        to: "/admins",
      },
      icon: <UserRoundCog key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Students",
      linkProps: {
        to: "/students",
      },
      icon: <GraduationCap key={crypto.randomUUID()} className="size-6" />,
    },
    {
      name: "Instructors",
      linkProps: {
        to: "/instructors",
      },
      icon: <BriefcaseBusiness key={crypto.randomUUID()} className="size-6" />,
    },
  ];

  const matchRoute = useMatchRoute();

  return (
    <div className="flex flex-col px-2 pt-4 shrink-0 w-[30%] max-w-[300px] h-full bg-main-bg">
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
