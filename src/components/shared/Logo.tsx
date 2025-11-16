import { Loader } from "lucide-react";
import { cn } from "../../lib/utils";

type Props = {
  className?: string;
  logoIconClassName?: string;
  logoWordClassName?: string;
  type: "admin-panel" | "lms";
};

export default function Logo({
  logoIconClassName,
  logoWordClassName,
  className,
  type,
}: Props) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader
        className={cn("size-8 stroke-mainaccent", { logoIconClassName })}
      />
      <div
        className={cn(
          "text-2xl font-semibold flex items-center gap-2",
          logoWordClassName
        )}
      >
        <p>CentraLearn</p>
        <p className="py-1 px-2 bg-mainaccent text-white rounded-lg text-xs">
          {type === "admin-panel" ? "Admin" : "LMS"}
        </p>
      </div>
    </div>
  );
}
