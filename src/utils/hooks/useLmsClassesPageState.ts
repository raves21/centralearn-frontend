import { useState } from "react";
import { useDebounceInput } from "./useDebounceInput";

export function useLmsClassesPageState() {
  const [searchQuery, setSearchQUery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [isSemesterFilterPopoverOpen, setIsSemesterFilterPopoverOpen] =
    useState(false);
  const [statusFilter, setStatusFilter] = useState<"open" | "close" | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusFilterPopoverOpen, setIsStatusFilterPopoverOpen] =
    useState(false);
  const debouncedInput = useDebounceInput({ value: searchQuery });

  return {
    searchQuery,
    setSearchQUery,
    semesterFilter,
    setSemesterFilter,
    isSemesterFilterPopoverOpen,
    setIsSemesterFilterPopoverOpen,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    isStatusFilterPopoverOpen,
    setIsStatusFilterPopoverOpen,
    debouncedInput,
  };
}
