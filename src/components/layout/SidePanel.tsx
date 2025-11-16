import { cn } from "../../lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import type { NavigationButton } from "@/utils/sharedTypes";

type Props = {
  routes: NavigationButton[];
};

export default function SidePanel({ routes }: Props) {
  const matchRoute = useMatchRoute();

  return (
    <div className="flex flex-col fixed left-0 top-[9dvh] pt-[28px] px-2 w-[30%] max-w-[300px] h-[calc(100dvh-9dvh)] overflow-auto bg-main-bg">
      {routes.map((route) => (
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
