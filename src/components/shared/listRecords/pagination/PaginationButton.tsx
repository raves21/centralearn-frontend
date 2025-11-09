import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected: boolean;
};

const PaginationButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, children, isSelected, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-medium group min-h-8 min-w-8 px-2 border hover:stroke-white hover:text-white text-mainaccent border-mainaccent text-sm mobile-m:size-12 mobile-m:text-base grid place-items-center transition-colors duration-100 rounded-md hover:border-mainAccent hover:bg-mainaccent-disabled",
          { "bg-mainaccent text-white": isSelected },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default PaginationButton;
