import Pagination from "@/components/shared/listRecords/pagination/Pagination";
import CourseClassCard from "@/components/shared/LMS/CourseClassCard";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDebounceInput } from "@/utils/hooks/useDebounceInput";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { useState } from "react";
import {
  useStudentEnrolledClasses,
  useStudentEnrolledSemesters,
} from "../../api/queries";

type Props = {
  studentId: string;
};

export default function StudentLmsClasses({ studentId }: Props) {
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

  const { data: enrolledClasses, status: enrolledClassesStatus } =
    useStudentEnrolledClasses({
      studentId,
      searchQuery: debouncedInput,
      page: currentPage,
      filters: {
        semester_id: semesterFilter,
        status: statusFilter ?? undefined,
      },
    });

  const { data: enrolledSemesters, status: enrolledSemestersStatus } =
    useStudentEnrolledSemesters(studentId);

  if ([enrolledSemestersStatus, enrolledClassesStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">
        <p className="text-xl font-medium">An error occured.</p>
      </div>
    );
  }

  if ([enrolledSemestersStatus, enrolledClassesStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (enrolledClasses && enrolledSemesters) {
    return (
      <div className="flex flex-col gap-8 h-full pb-12">
        <p className="text-2xl font-bold">Classes</p>
        <div className="w-[80%] self-end flex items-center gap-4">
          <Input
            placeholder={"Search classes by name/code"}
            value={searchQuery}
            onChange={(e) => setSearchQUery(e.currentTarget.value)}
            className="flex-1"
          />
          <Popover
            open={isSemesterFilterPopoverOpen}
            onOpenChange={setIsSemesterFilterPopoverOpen}
            modal={true}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "flex-1 justify-between font-normal",
                  !semesterFilter && "text-muted-foreground"
                )}
              >
                {semesterFilter
                  ? `${
                      enrolledSemesters.find(
                        (semester) => semester.id === semesterFilter
                      )?.name
                    }`
                  : "Filter by Semester"}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 font-poppins">
              <Command>
                <CommandInput placeholder="Search semester..." />
                <CommandList>
                  <CommandEmpty>No semester found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key={"any"}
                      value={"Any"}
                      onSelect={() => {
                        setSemesterFilter("");
                        setIsSemesterFilterPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !semesterFilter ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Any
                    </CommandItem>
                    {enrolledSemesters.map((semester) => (
                      <CommandItem
                        key={semester.id}
                        value={`${semester.name}`}
                        onSelect={() => {
                          setSemesterFilter(semester.id);
                          setIsSemesterFilterPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            semester.id === semesterFilter
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {semester.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover
            open={isStatusFilterPopoverOpen}
            onOpenChange={setIsStatusFilterPopoverOpen}
            modal={true}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "flex-1 justify-between font-normal",
                  !statusFilter && "text-muted-foreground"
                )}
              >
                {statusFilter === null && "Filter by Status"}
                {statusFilter === "close" && "Closed Classes"}
                {statusFilter === "open" && "Open Classes"}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 font-poppins">
              <Command>
                <CommandInput placeholder="Search semester..." />
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      key={"any"}
                      value={"Any"}
                      onSelect={() => {
                        setStatusFilter(null);
                        setIsStatusFilterPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          statusFilter === null ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Any
                    </CommandItem>
                    {["Open classes", "Closed classes"].map((status) => {
                      const value =
                        status === "Open classes" ? "open" : "close";
                      const lowercaseStatus =
                        status.charAt(0).toLowerCase() + status.slice(1);
                      return (
                        <CommandItem
                          key={lowercaseStatus}
                          value={value}
                          onSelect={() => {
                            setStatusFilter(value);
                            setIsStatusFilterPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              statusFilter === value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {status}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {enrolledClasses.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {enrolledClasses.data.map((courseClass) => (
              <CourseClassCard courseClass={courseClass} />
            ))}
          </div>
        ) : (
          <div className="flex-grow grid place-items-center">
            <p className="pb-30 text-lg">No results</p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          handlePageChange={() => setCurrentPage((prev) => prev + 1)}
          totalPages={enrolledClasses.meta.last_page}
        />
      </div>
    );
  }
}
