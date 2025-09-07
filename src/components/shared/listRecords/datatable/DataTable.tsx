"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Pagination from "../../pagination/Pagination";
import TableFilters from "./TableFilters";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  paginationProps: {
    totalPages: number;
    currentPage: number;
    handlePageChange: (e: React.ChangeEvent<unknown>, page: number) => void;
  };
  filterProps: {
    onInputSearch: (input: string) => void;
    searchInputPlaceholder: string;
    searchInputInitValue: string | undefined;
  };
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  paginationProps,
  filterProps,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("rounded-xl flex flex-col gap-4 pb-6", className)}>
      <TableFilters
        table={table}
        onInputSearch={filterProps.onInputSearch}
        searchInputPlaceholder={filterProps.searchInputPlaceholder}
        searchInputInitValue={filterProps.searchInputInitValue}
      />
      <Table className="bg-white rounded-lg">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-white">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="py-5 px-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:cursor-pointer"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-5 px-3" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        currentPage={paginationProps.currentPage}
        handlePageChange={paginationProps.handlePageChange}
        totalPages={paginationProps.totalPages}
      />
    </div>
  );
}
