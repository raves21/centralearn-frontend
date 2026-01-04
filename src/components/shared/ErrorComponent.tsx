import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function ErrorComponent({ className }: Props) {
  return (
    <div className={cn("size-full grid place-items-center", className)}>
      An error occured.
    </div>
  );
}
