import { usePendingOverlay } from "@/components/shared/globals/pendingOverlay/usePendingOverlay";
import { useCreateSemester } from "@/domains/semesters/api/mutations";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Form,
  FormControl,
  FormDescription,
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
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader } from "lucide-react";
import { useCreateSemesterMinMaxTimestamps } from "@/domains/semesters/api/queries";
import dayjs from "dayjs";

export const Route = createFileRoute("/_protected/semesters/create/")({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1, { error: "This field is required." }),
  startDate: z
    .date()
    .nullable()
    .refine((val) => val !== null, { error: "This field is required." }),
  endDate: z
    .date()
    .nullable()
    .refine((val) => val !== null, { error: "This field is required." }),
});

function RouteComponent() {
  const { mutateAsync: createSemester, status: createSemesterStatus } =
    useCreateSemester();

  const { data: minMaxTimestamps, status: minMaxTimestampsStatus } =
    useCreateSemesterMinMaxTimestamps();

  usePendingOverlay({
    isPending: createSemesterStatus === "pending",
    pendingLabel: "Creating Semester",
  });

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: null,
      endDate: null,
    },
  });

  async function onSubmit({
    endDate,
    name,
    startDate,
  }: z.infer<typeof formSchema>) {
    try {
      if (name && endDate && startDate) {
        await createSemester({ name, endDate, startDate });
        navigate({ to: "/semesters" });
      }
    } catch (error) {
      toast.error("An error occured.");
    }
  }

  const startDate = form.watch("startDate");

  return (
    <div className="flex flex-col gap-16 size-full">
      <div className="flex flex-col gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/semesters">Semesters</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-2xl font-bold">Create Semester</p>
      </div>
      {minMaxTimestampsStatus === "error" && (
        <div className="flex-1 grid place-items-center">An error occured.</div>
      )}
      {minMaxTimestampsStatus === "pending" && (
        <div className="flex-1 grid place-items-center">
          <Loader className="size-15 stroke-mainaccent animate-spin" />
        </div>
      )}
      {minMaxTimestamps && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-8"
          >
            <div className="flex flex-col gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-start w-full gap-10">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal shadow-none border-gray-400",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            endMonth={new Date(dayjs().year() + 5, 0)}
                            showOutsideDays={false}
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              if (!minMaxTimestamps.startDateMin) return false;
                              return dayjs(date).isBefore(
                                dayjs(minMaxTimestamps.startDateMin),
                                "day"
                              );
                            }}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        You can only choose dates that come after the latest
                        semester's end date
                        <br />
                        <span className="text-red-500">{`(${dayjs(
                          minMaxTimestamps.startDateMin
                        ).format("MMM DD, YYYY")} onwards)`}</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={!form.watch("startDate")}
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal shadow-none border-gray-400",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            endMonth={new Date(dayjs().year() + 5, 0)}
                            showOutsideDays={false}
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              if (!startDate) return false;
                              return (
                                dayjs(date).isBefore(startDate, "day") ||
                                dayjs(date).isSame(startDate, "day")
                              );
                            }}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        You can only choose dates that come after the start date
                        <br />
                        {startDate && (
                          <span className="text-red-500">{`(${dayjs(startDate)
                            .add(1, "day")
                            .format("MMM DD, YYYY")} onwards)`}</span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button
                type="submit"
                className="flex hover:bg-indigo-700 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-2 py-[10px] text-white rounded-md bg-mainaccent"
              >
                Create
              </button>
              <button
                disabled={createSemesterStatus === "pending"}
                onClick={() => navigate({ to: "/semesters" })}
                type="button"
                className="flex disabled:bg-gray-200 hover:bg-gray-200 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-white border-2 border-gray-600/50 text-black"
              >
                Cancel
              </button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
