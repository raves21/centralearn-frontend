import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ImageUpload from "@/components/shared/form/ImageUpload";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { useCreateCourseClass } from "@/domains/classes/api/mutations";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAllCourses } from "@/domains/courses/api/queries";
import { useAllSemesters } from "@/domains/semesters/api/queries";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatToSemesterNameAndTimestamps } from "@/domains/semesters/functions";

export const Route = createFileRoute("/_protected/classes/create/")({
  component: RouteComponent,
});

const formSchema = z.object({
  courseId: z.string().min(1, { error: "This field is required." }),
  semesterId: z.string().min(1, { error: "This field is required." }),
  sectionName: z.string().min(1, { error: "This field is required." }),
  status: z.enum(["open", "close"]),
});

function RouteComponent() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const { mutateAsync: createCourseClass, status: createCourseClassStatus } =
    useCreateCourseClass();

  const { data: allCourses, status: allCoursesStatus } = useAllCourses({});
  const { data: allSemesters, status: allSemestersStatus } = useAllSemesters(
    {}
  );

  usePendingOverlay({
    isPending: createCourseClassStatus === "pending",
    pendingLabel: "Creating Class",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      sectionName: "",
      semesterId: "",
      status: "open",
    },
  });

  async function onSubmit({
    courseId,
    sectionName,
    semesterId,
    status,
  }: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("course_id", courseId);
      formData.append("section_name", sectionName);
      formData.append("semester_id", semesterId);
      formData.append("status", status);
      await createCourseClass(formData);
      navigate({ to: "/classes" });
    } catch (error) {
      toast.error("An error occured.");
    }
  }

  if ([allCoursesStatus, allSemestersStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if ([allCoursesStatus, allSemestersStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (allCourses && allSemesters) {
    return (
      <div className="flex flex-col gap-16 size-full pb-12">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate({ to: "/classes" })}>
                  Classes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Create Class</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-8"
          >
            <div className="flex flex-col gap-8">
              <div className="flex w-full gap-10">
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem className="flex-1 font-poppins">
                      <FormLabel>
                        Course <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? `${
                                    allCourses.find(
                                      (course) => course.id === field.value
                                    )?.name
                                  } (${
                                    allCourses.find(
                                      (course) => course.id === field.value
                                    )?.code
                                  })`
                                : "Select Course..."}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 font-poppins">
                          <Command>
                            <CommandInput placeholder="Search Course..." />
                            <CommandList>
                              <CommandEmpty>No course found.</CommandEmpty>
                              <CommandGroup>
                                {allCourses.map((course) => (
                                  <CommandItem
                                    key={course.id}
                                    value={`${course.name} (${course.code})`}
                                    onSelect={() => {
                                      field.onChange(course.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        course.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {`${course.name} (${course.code})`}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="semesterId"
                  render={({ field }) => (
                    <FormItem className="flex-1 font-poppins">
                      <FormLabel>
                        Semester <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? formatToSemesterNameAndTimestamps(
                                    allSemesters.find(
                                      (semester) => semester.id === field.value
                                    )!
                                  )
                                : "Select Department..."}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 font-poppins">
                          <Command>
                            <CommandInput placeholder="Search Department..." />
                            <CommandList>
                              <CommandEmpty>No department found.</CommandEmpty>
                              <CommandGroup>
                                {allSemesters.map((semester) => (
                                  <CommandItem
                                    key={semester.id}
                                    value={formatToSemesterNameAndTimestamps(
                                      semester
                                    )}
                                    onSelect={() => {
                                      field.onChange(semester.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        semester.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {formatToSemesterNameAndTimestamps(
                                      semester
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-start w-full gap-10">
                <FormField
                  control={form.control}
                  name="sectionName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Section Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex-1 font-poppins">
                      <FormLabel>
                        Status <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value === "open" ? "Open" : "Close"}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 font-poppins">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                <CommandItem
                                  value="open"
                                  onSelect={() => {
                                    field.onChange("open");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === "open"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Open
                                </CommandItem>
                                <CommandItem
                                  value="close"
                                  onSelect={() => {
                                    field.onChange("close");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === "close"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Close
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <p>Image</p>
                <ImageUpload
                  className="w-[360px]"
                  imageProps={{
                    image,
                    setImage,
                  }}
                  previewProps={{
                    preview,
                    setPreview,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button
                type="submit"
                className="flex hover:bg-indigo-800 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-2 py-[10px] text-white rounded-md bg-mainaccent"
              >
                Create
              </button>
              <button
                disabled={createCourseClassStatus === "pending"}
                onClick={() => navigate({ to: "/classes" })}
                type="button"
                className="flex hover:bg-gray-400 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-gray-300 border-2 text-black"
              >
                Cancel
              </button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
}
