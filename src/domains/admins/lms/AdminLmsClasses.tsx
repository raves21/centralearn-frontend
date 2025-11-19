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
import { useCourseClasses } from "@/domains/classes/api/queries";
import { useAllSemesters } from "@/domains/semesters/api/queries";
import { cn } from "@/lib/utils";
import { useDebounceInput } from "@/utils/hooks/useDebounceInput";
import { useFocusInput } from "@/utils/hooks/useFocusInput";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { useState } from "react";

export default function AdminLmsClasses() {
  const [searchQuery, setSearchQUery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [isSemesterFilterPopoverOpen, setIsSemesterFilterPopoverOpen] =
    useState(false);
  const [statusFilter, setStatusFilter] = useState<"open" | "close" | null>(
    null
  );
  const [isStatusFilterPopoverOpen, setIsStatusFilterPopoverOpen] =
    useState(false);
  const debouncedInput = useDebounceInput({ value: searchQuery, delay: 400 });

  const { inputRef } = useFocusInput({});

  const { data: courseClasses, status: courseClassesStatus } = useCourseClasses(
    {}
  );

  const { data: allSemesters, status: allSemestersStatus } = useAllSemesters(
    {}
  );

  if ([allSemestersStatus, courseClassesStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">
        <p className="text-xl font-medium">An error occured.</p>
      </div>
    );
  }

  if ([allSemestersStatus, courseClassesStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (courseClasses && allSemesters) {
    return (
      <div className="flex flex-col gap-8 h-full pb-12">
        <p className="text-2xl font-bold">Classes</p>
        <div className="w-[80%] self-end flex items-center gap-4">
          <Input
            ref={inputRef}
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
                      allSemesters.find(
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
                          statusFilter === null ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Any
                    </CommandItem>
                    {allSemesters.map((semester) => (
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
                    {["Open", "Close"].map((status) => {
                      const lowercaseStatus =
                        status.charAt(0).toLowerCase() + status.slice(1);
                      return (
                        <CommandItem
                          key={lowercaseStatus}
                          value={status}
                          onSelect={() => {
                            setStatusFilter(
                              lowercaseStatus as "open" | "close"
                            );
                            setIsStatusFilterPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              statusFilter === lowercaseStatus
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
        {courseClasses.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courseClasses.data.map((courseClass) => (
              <CourseClassCard courseClass={courseClass} />
            ))}
          </div>
        ) : (
          <div className="flex-grow grid place-items-center">
            <p className="pb-30 text-lg">No results</p>
          </div>
        )}
      </div>
    );
  }
}
