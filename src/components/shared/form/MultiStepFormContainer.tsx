import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";
import type { PropsWithChildren } from "react";

type Props = {
  stepFieldEntries: any[];
  currentStep: number;
} & PropsWithChildren;

export default function MultiStepFormContainer({
  children,
  stepFieldEntries,
  currentStep,
}: Props) {
  return (
    <div className="flex flex-col bg-white border-2 border-gray-200 rounded-lg">
      <div className="flex border-b-2 border-gray-200">
        {stepFieldEntries.map(([key, value], i) => {
          return (
            <div
              key={i}
              className={cn("flex-1 py-3 px-4 flex items-center gap-4", {
                "border-r-2 border-gray-200": i !== stepFieldEntries.length - 1,
              })}
            >
              <div className="relative">
                <Circle
                  className={cn(
                    "size-[50px] stroke-gray-300 rounded-full stroke-1",
                    {
                      "stroke-mainaccent font-medium":
                        parseInt(key) === currentStep,
                    }
                  )}
                />
                <p
                  className={cn(
                    "absolute top-1/2 left-1/2 text-gray-500 -translate-x-1/2 -translate-y-1/2",
                    {
                      "text-mainaccent font-medium":
                        parseInt(key) === currentStep,
                    }
                  )}
                >
                  {key}
                </p>
              </div>
              <p
                className={cn("text-gray-500", {
                  "text-mainaccent font-medium": parseInt(key) === currentStep,
                })}
              >
                {value.label}
              </p>
            </div>
          );
        })}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
