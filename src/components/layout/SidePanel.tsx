import { LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

type SidePanelRoute = {
  name: string;
};

const routesTemp: SidePanelRoute[] = [
  {
    name: "Dashboard",
  },
  {
    name: "Departments",
  },
  {
    name: "Semesters",
  },
  {
    name: "Admins",
  },
  {
    name: "Students",
  },
  {
    name: "Classes",
  },
];

export default function SidePanel() {
  const [selected, setSelected] = useState<SidePanelRoute>(routesTemp[0]);
  return (
    <div className="flex flex-col p-2 w-[18%] h-full pt-[95px] bg-main-bg">
      {routesTemp.map((routeTemp, i) => (
        <button
          onClick={() => setSelected(routeTemp)}
          key={i}
          className={cn(
            "p-3 flex items-center w-full text-gray-500 gap-3 rounded-md font-medium",
            {
              "bg-mainaccent text-white": routeTemp === selected,
            }
          )}
        >
          <LayoutDashboard className="size-6" />
          {routeTemp.name}
        </button>
      ))}
    </div>
  );
}
