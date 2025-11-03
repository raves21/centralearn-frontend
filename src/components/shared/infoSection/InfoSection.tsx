import { cn } from "@/lib/utils";
import type { TInfoSection } from "@/utils/sharedTypes";

type Props = {
  infoSection: TInfoSection;
  className?: string;
};

export default function InfoSection({ infoSection, className }: Props) {
  return (
    <div
      className={cn("flex flex-col gap-6 bg-main-bg p-4 rounded-lg", className)}
    >
      <p className="font-medium text-lg">{infoSection.header}</p>
      <div className="flex gap-24">
        <div className="flex flex-col gap-4">
          {infoSection.details.map((details) => (
            <p className="font-medium">{details.label}:</p>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {infoSection.details.map((details) => (
            <p>{details.value}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
