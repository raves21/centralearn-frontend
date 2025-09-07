import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebounceInput } from "@/utils/hooks/useDebounceInput";
import { useFocusInput } from "@/utils/hooks/useFocusInput";
import type { Table } from "@tanstack/react-table";
import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onInputSearch: (input: string) => void;
  searchInputPlaceholder: string;
  searchInputInitValue: string | undefined;
  table: Table<any>;
};

export default function TableFilters({
  onInputSearch,
  searchInputPlaceholder,
  table,
  searchInputInitValue,
}: Props) {
  const [searchInput, setSearchInput] = useState(searchInputInitValue ?? "");

  const debouncedInput = useDebounceInput({ value: searchInput, delay: 400 });

  const { inputRef } = useFocusInput({});

  useEffect(() => {
    onInputSearch(debouncedInput);
  }, [debouncedInput]);

  return (
    <div className="w-full flex items-center justify-end gap-6 px-3">
      <Input
        ref={inputRef}
        placeholder={searchInputPlaceholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.currentTarget.value)}
        className="w-[400px] shadow-none border-gray-400 focus-visible:ring-mainaccent/50"
      />
      <button className="bg-none border-1 min-w-[110px] justify-center rounded-md px-3 gap-2 text-black py-2 hover:ring-mainaccent/50 hover:ring-[2px] transition-all flex items-center border-gray-400">
        <Filter className="size-4" />
        <p>Filters</p>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-none border-1 rounded-md min-w-[110px] px-3 gap-2 text-black py-2 hover:ring-mainaccent/50 hover:ring-[2px] transition-all flex items-center border-gray-400">
            <p>Columns</p>
            <ChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize font-poppins"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
