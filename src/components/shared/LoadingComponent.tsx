import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

type Props = {
  containerClassName?: string;
  loaderClassName?: string;
};

export default function LoadingComponent({
  containerClassName,
  loaderClassName,
}: Props) {
  return (
    <div
      className={cn("size-full grid place-items-center", containerClassName)}
    >
      <Loader
        className={cn(
          "size-15 stroke-mainaccent animate-spin",
          loaderClassName,
        )}
      />
    </div>
  );
}
