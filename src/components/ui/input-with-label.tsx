import * as React from "react";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  isRequired?: boolean;
  containerClassName?: string;
  inputClassName?: string;
};

function InputWithLabel({
  containerClassName,
  inputClassName,
  label,
  isRequired = true,
  type,
  ...props
}: Omit<React.ComponentProps<"input">, "className"> & Props) {
  return (
    <div className={cn("flex flex-col gap-3", containerClassName)}>
      {label && (
        <p>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </p>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "shadow-none border-gray-400 focus-visible:ring-mainaccent focus-visible:border-none w-full bg-white",
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}

export { InputWithLabel };
