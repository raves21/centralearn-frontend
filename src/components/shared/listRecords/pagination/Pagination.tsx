import usePagination from "@mui/material/usePagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PaginationButton from "./PaginationButton";

type Props = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (e: React.ChangeEvent<unknown>, page: number) => void;
  className?: string;
};

export default function Pagination({
  totalPages,
  currentPage,
  handlePageChange,
  className,
}: Props) {
  const { items } = usePagination({
    onChange: handlePageChange,
    count: totalPages,
    page: currentPage,
  });

  return (
    <nav className={className}>
      <ul className="flex flex-wrap items-center justify-end w-full gap-2 px-2">
        {items.map((item, index) => {
          const { page, selected, type } = item;
          let child = null;

          if (type === "start-ellipsis" || type === "end-ellipsis") {
            child = "…";
          } else if (type === "page") {
            child = (
              <PaginationButton
                type="button"
                isSelected={selected}
                onClick={item.onClick}
                disabled={item.disabled || selected}
              >
                {page}
              </PaginationButton>
            );
          } else {
            if (
              (type === "previous" && currentPage === 1) ||
              (type === "next" && currentPage === totalPages)
            ) {
              child = null;
            } else {
              child = (
                <PaginationButton
                  type="button"
                  isSelected={selected}
                  onClick={item.onClick}
                  disabled={item.disabled || selected}
                >
                  {type === "previous" ? (
                    <ChevronLeft className="size-6 stroke-mainaccent group-hover:stroke-white" />
                  ) : (
                    <ChevronRight className="size-6 stroke-mainaccent group-hover:stroke-white" />
                  )}
                </PaginationButton>
              );
            }
          }

          return <li key={index}>{child}</li>;
        })}
      </ul>
    </nav>
  );
}
