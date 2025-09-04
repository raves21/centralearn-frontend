import { Loader } from "lucide-react";
import { cn } from "../../lib/utils";

type Props = {
  className?: string;
  logoIconClassName?: string;
  logoWordClassName?: string;
};

export default function Logo({
  logoIconClassName,
  logoWordClassName,
  className,
}: Props) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader
        className={cn("size-8 stroke-mainaccent", { logoIconClassName })}
      />
      <p className={cn("text-2xl font-semibold", logoWordClassName)}>
        CentraLearn
      </p>
    </div>
  );
}
