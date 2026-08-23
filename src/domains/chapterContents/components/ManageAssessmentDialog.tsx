import {
  useCreateAssessment,
  useEditAssessment,
} from "@/domains/chapterContents/api/mutations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { toast } from "sonner";
import { api } from "@/utils/axiosBackend";
import DateTimePicker from "@/components/shared/form/DateTimePicker";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import {
  formatToLocal,
  formatToUTC,
  hoursMinutesToSeconds,
  secondsToHoursMinutes,
} from "@/utils/sharedFunctions";
import type {
  Assessment,
  ChapterContent,
} from "@/domains/chapterContents/types";
import { useEffect } from "react";
import { useChapterContentInfo } from "../api/queries";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NumberStepper from "@/components/shared/form/NumberStepper";

type EditProps = {
  type: "edit";
  chapterContent: ChapterContent;
};

type CreateProps = {
  type: "create";
};

type Props = {
  chapterId: string;
} & (EditProps | CreateProps);

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    accessibility_type: z.enum(["visible", "hidden", "custom"]),
    access_from: z.date().optional().nullable(),
    access_until: z.date().optional().nullable(),

    // Assessment specific
    time_limit_hours: z.coerce
      .number()
      .int()
      .min(0)
      .max(5)
      .optional()
      .nullable(),
    time_limit_minutes: z.coerce
      .number()
      .int()
      .min(0)
      .max(59)
      .optional()
      .nullable(),
    due_date: z.date().optional().nullable(),
    after_due_date_behavior: z
      .enum(["auto_submit", "block_new_attempts", "allow_all"])
      .optional()
      .nullable(),
    is_answers_viewable_after_submit: z.boolean(),
    is_score_viewable_after_submit: z.boolean(),
    is_multi_attempts: z.boolean(),
    max_attempts: z.coerce.number().optional().nullable(),
    multi_attempt_grading_type: z
      .enum(["avg_score", "highest_score"])
      .optional()
      .nullable(),
    has_time_limit: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.accessibility_type === "custom") {
      if (!data.access_from) {
        ctx.addIssue({
          code: "custom",
          message: "Access From is required when using Custom Access.",
          path: ["access_from"],
        });
      }
      if (
        data.access_from &&
        data.access_until &&
        data.access_until <= data.access_from
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Access Until must be after Access From.",
          path: ["access_until"],
        });
      }
    }

    if (data.due_date && !data.after_due_date_behavior) {
      ctx.addIssue({
        code: "custom",
        message: "Behavior after due date is required.",
        path: ["after_due_date_behavior"],
      });
    }

    if (!data.time_limit_hours && !data.time_limit_minutes) {
      // Allow null if optional, but here we probably want at least something if it's set?
      // Actually the previous one had .min(1, "Time limit...").
      // If they are both 0 or null, we might want to flag it if a time limit is intended.
    }

    // Multi-attempts validation
    if (data.is_multi_attempts) {
      if (!data.max_attempts || data.max_attempts < 2) {
        ctx.addIssue({
          code: "custom",
          message:
            "Max attempts must be at least 2 when multi-attempts is enabled.",
          path: ["max_attempts"],
        });
      }
      if (data.max_attempts && data.max_attempts > 5) {
        ctx.addIssue({
          code: "custom",
          message: "Max attempts cannot exceed 5.",
          path: ["max_attempts"],
        });
      }
      if (!data.multi_attempt_grading_type) {
        ctx.addIssue({
          code: "custom",
          message: "Grading type is required when multi-attempts is enabled.",
          path: ["multi_attempt_grading_type"],
        });
      }
    }
  });

export default function ManageAssessmentDialog({ chapterId, ...props }: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);
  const { mutateAsync: createAssessment, status: createAssessmentStatus } =
    useCreateAssessment();

  const { mutateAsync: editAssessment, status: editAssessmentStatus } =
    useEditAssessment();

  usePendingOverlay({
    isPending: editAssessmentStatus === "pending",
    pendingLabel: "Editing Assessment",
  });

  usePendingOverlay({
    isPending: createAssessmentStatus === "pending",
    pendingLabel: "Creating Assessment",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      name: "",
      description: "",
      accessibility_type: "hidden",
      access_from: null,
      access_until: null,
      time_limit_hours: 0,
      time_limit_minutes: 0,
      due_date: null,
      after_due_date_behavior: null,
      is_answers_viewable_after_submit: true,
      is_score_viewable_after_submit: true,
      is_multi_attempts: false,
      max_attempts: 2,
      multi_attempt_grading_type: "highest_score",
      has_time_limit: false,
    },
  });

  const editProps = props.type === "edit" ? props : null;

  const { data: chapterContentInfo, status: chapterContentInfoStatus } =
    useChapterContentInfo(editProps?.chapterContent.id);

  // Load data for edit
  useEffect(() => {
    if (chapterContentInfo) {
      // Type assertion/check for assessment content
      const assessmentContent = chapterContentInfo.content as Assessment;

      let type: "visible" | "hidden" | "custom" = "hidden";
      let accessFrom = null;
      let accessUntil = null;

      if (chapterContentInfo.accessibilitySettings) {
        const settings = chapterContentInfo.accessibilitySettings;
        if (settings.visible === true) type = "visible";
        else if (settings.visible === false) type = "hidden";
        else if (settings.custom) {
          type = "custom";
          accessFrom = settings.custom.access_from
            ? new Date(formatToLocal(settings.custom.access_from))
            : null;
          accessUntil = settings.custom.access_until
            ? new Date(formatToLocal(settings.custom.access_until))
            : null;
        }
      }

      form.reset({
        name: chapterContentInfo.name,
        description: chapterContentInfo.description ?? "",
        accessibility_type: type,
        access_from: accessFrom,
        access_until: accessUntil,

        // Assessment specific
        time_limit_hours: assessmentContent.submissionSettings?.timeLimitSeconds
          ? secondsToHoursMinutes(
              assessmentContent.submissionSettings.timeLimitSeconds,
            ).hours
          : 0,
        time_limit_minutes: assessmentContent.submissionSettings
          ?.timeLimitSeconds
          ? secondsToHoursMinutes(
              assessmentContent.submissionSettings.timeLimitSeconds,
            ).minutes
          : 0,
        due_date: assessmentContent.submissionSettings?.dueDate
          ? new Date(
              formatToLocal(assessmentContent.submissionSettings.dueDate),
            )
          : null,
        after_due_date_behavior:
          assessmentContent.submissionSettings?.afterDueDateBehavior ?? null,
        is_answers_viewable_after_submit:
          assessmentContent.isAnswersViewableAfterSubmit,
        is_score_viewable_after_submit:
          assessmentContent.isScoreViewableAfterSubmit,
        max_attempts: assessmentContent.maxAttempts,
        is_multi_attempts: assessmentContent.maxAttempts > 1,
        multi_attempt_grading_type: assessmentContent.multiAttemptGradingType,
        has_time_limit:
          !!assessmentContent.submissionSettings?.timeLimitSeconds,
      });
    }
  }, [chapterContentInfo]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("chapter_id", chapterId);
      formData.append("content_type", "assessment");
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);

      if (editProps) {
        formData.append("order", editProps.chapterContent.order.toString());
      } else {
        const { data: chapterContentCount } = await api.get(
          `/chapters/${chapterId}/content-count`,
        );
        formData.append("order", (chapterContentCount + 1).toString());
      }

      if (data.accessibility_type === "visible") {
        formData.append("accessibility_settings[visible]", "1");
      } else if (data.accessibility_type === "hidden") {
        formData.append("accessibility_settings[visible]", "0");
      } else if (data.accessibility_type === "custom") {
        if (data.access_from) {
          formData.append(
            "accessibility_settings[custom][access_from]",
            formatToUTC(data.access_from),
          );
        }
        if (data.access_until) {
          formData.append(
            "accessibility_settings[custom][access_until]",
            formatToUTC(data.access_until),
          );
        }
      }

      // Assessment specific form data
      const totalSeconds = data.has_time_limit
        ? hoursMinutesToSeconds(
            data.time_limit_hours ?? 0,
            data.time_limit_minutes ?? 0,
          )
        : 0;
      formData.append(
        "content[submission_settings][time_limit_seconds]",
        totalSeconds.toString(),
      );
      if (data.due_date) {
        console.log(data.due_date);
        formData.append(
          "content[submission_settings][due_date]",
          formatToUTC(data.due_date),
        );
        if (data.after_due_date_behavior) {
          formData.append(
            "content[submission_settings][after_due_date_behavior]",
            data.after_due_date_behavior,
          );
        }
      }
      formData.append(
        "content[is_answers_viewable_after_submit]",
        data.is_answers_viewable_after_submit ? "1" : "0",
      );
      formData.append(
        "content[is_score_viewable_after_submit]",
        data.is_score_viewable_after_submit ? "1" : "0",
      );
      formData.append(
        "content[is_multi_attempts]",
        data.is_multi_attempts ? "1" : "0",
      );

      if (data.is_multi_attempts) {
        if (data.max_attempts)
          formData.append(
            "content[max_attempts]",
            data.max_attempts.toString(),
          );
        if (data.multi_attempt_grading_type)
          formData.append(
            "content[multi_attempt_grading_type]",
            data.multi_attempt_grading_type,
          );
      } else {
        formData.append("content[max_attempts]", "1");
      }

      if (editProps) {
        await editAssessment({
          id: editProps.chapterContent.id,
          formData,
        });
      } else {
        await createAssessment(formData);
      }
      toggleOpenDialog(null);
    } catch (error) {
      //   console.error(error);
      toast.error("An error occured.");
    }
  }

  const accessibilityType = form.watch("accessibility_type");
  const accessFrom = form.watch("access_from");
  const isMultiAttempts = form.watch("is_multi_attempts");
  const dueDate = form.watch("due_date");
  const hasTimeLimit = form.watch("has_time_limit");

  useEffect(() => {
    if (!dueDate) {
      form.setValue("after_due_date_behavior", null);
    }
  }, [dueDate, form]);

  if ([chapterContentInfoStatus].includes("error") && editProps) {
    return (
      <div className="size-[300px]">
        <ErrorComponent className="text-xl font-medium text-red-500" />
      </div>
    );
  }

  if ([chapterContentInfoStatus].includes("pending") && editProps) {
    return (
      <div className="size-[300px]">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="w-[700px] bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">
        {editProps ? "Update Assessment" : "Create new Assessment"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Assessment Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description (optional)"
                    className="resize-none max-h-30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 p-4 border rounded-md">
            <h3 className="font-semibold text-sm">Submission Settings</h3>
            <div className="mb-5 mt-2 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="has_time_limit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          if (!e.target.checked) {
                            form.setValue("time_limit_hours", 0);
                            form.setValue("time_limit_minutes", 0);
                          }
                        }}
                        className="h-4 w-4 cursor-pointer accent-mainaccent"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Add time limit</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {hasTimeLimit && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="time_limit_hours"
                    render={({ field }) => {
                      const value = field.value ?? 0;
                      return (
                        <FormItem>
                          <FormLabel>Hours</FormLabel>
                          <FormControl>
                            <NumberStepper
                              value={value}
                              min={0}
                              max={5}
                              onIncrease={() => field.onChange(value + 1)}
                              onDecrease={() => field.onChange(value - 1)}
                              onInput={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="time_limit_minutes"
                    render={({ field }) => {
                      const value = field.value ?? 0;
                      return (
                        <FormItem>
                          <FormLabel>Minutes</FormLabel>
                          <FormControl>
                            <NumberStepper
                              value={value}
                              min={0}
                              max={59}
                              onIncrease={() => field.onChange(value + 1)}
                              onDecrease={() => field.onChange(value - 1)}
                              onInput={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onSelect={field.onChange}
                      onClear={() => field.onChange(null)}
                      label="Due Date (optional)"
                      minDateTime={new Date()}
                    />
                  )}
                />
              </div>
              {dueDate && (
                <FormField
                  control={form.control}
                  name="after_due_date_behavior"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>After Due Date Behavior</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-3">
                          {[
                            {
                              value: "auto_submit",
                              label: "Force Submit Ongoing, Block New",
                              description:
                                "Ongoing Attempts: Force-submitted at due date. New Attempts: Blocked.",
                            },
                            {
                              value: "block_new_attempts",
                              label: "Allow Ongoing, Block New",
                              description:
                                "Ongoing Attempts: May be completed past due date. New Attempts: Blocked.",
                            },
                            {
                              value: "allow_all",
                              label: "Allow All",
                              description:
                                "Ongoing Attempts: May be completed past due date. New Attempts: Allowed.",
                            },
                          ].map((item) => (
                            <div
                              key={item.value}
                              className={`flex items-start space-x-3 space-y-0 p-3 border rounded-md cursor-pointer transition-colors ${
                                field.value === item.value
                                  ? "border-mainaccent bg-mainaccent/5"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => field.onChange(item.value)}
                            >
                              <input
                                type="checkbox"
                                checked={field.value === item.value}
                                onChange={() => field.onChange(item.value)}
                                className="h-4 w-4 mt-1 cursor-pointer accent-mainaccent"
                              />
                              <div className="flex flex-col gap-1 cursor-pointer">
                                <span className="font-medium text-sm">
                                  {item.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4 border rounded-md">
            <h3 className="font-semibold text-sm mb-2">Students can:</h3>
            <FormField
              control={form.control}
              name="is_answers_viewable_after_submit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1 cursor-pointer accent-mainaccent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>View Answers After Submit</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_score_viewable_after_submit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1 cursor-pointer accent-mainaccent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>View Score After Submit</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4 p-4 border rounded-md">
            <h3 className="font-semibold text-sm">Attempt Settings</h3>
            <FormField
              control={form.control}
              name="is_multi_attempts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1 cursor-pointer accent-mainaccent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Multiple Attempts</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {isMultiAttempts ? (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="max_attempts"
                  render={({ field }) => {
                    const value = field.value ?? 2;
                    return (
                      <FormItem>
                        <FormLabel>Max Attempts</FormLabel>
                        <FormControl>
                          <NumberStepper
                            value={value}
                            min={2}
                            max={5}
                            onIncrease={() => field.onChange(value + 1)}
                            onDecrease={() => field.onChange(value - 1)}
                            onInput={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="multi_attempt_grading_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grading Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grading type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[200] font-poppins">
                          <SelectItem value="avg_score">
                            Average Score
                          </SelectItem>
                          <SelectItem value="highest_score">
                            Highest Score
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 p-4 border rounded-md">
            <h3 className="font-semibold text-sm mb-2">
              Accessibility Settings
            </h3>
            <FormField
              control={form.control}
              name="accessibility_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    key={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("access_from", null);
                      form.setValue("access_until", null);
                      form.clearErrors("access_from");
                      form.clearErrors("access_until");
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[200] font-poppins">
                      <SelectItem value="visible">Always Visible</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                      <SelectItem value="custom">
                        Custom Access Period
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {accessibilityType === "custom" && (
              <div className="w-full flex gap-4 mt-2">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="access_from"
                    render={({ field }) => (
                      <DateTimePicker
                        value={field.value}
                        onSelect={field.onChange}
                        onClear={() => field.onChange(null)}
                        label="Access From"
                        minDateTime={new Date()}
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  {(accessFrom || form.getValues("access_from")) && (
                    <FormField
                      control={form.control}
                      name="access_until"
                      render={({ field }) => (
                        <DateTimePicker
                          value={field.value}
                          onSelect={field.onChange}
                          onClear={() => field.onChange(null)}
                          label="Access Until (optional)"
                          minDateTime={accessFrom ?? undefined}
                        />
                      )}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleOpenDialog(null)}
              className="bg-gray-100 text-black border-gray-400 hover:bg-gray-300 flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-mainaccent hover:bg-indigo-800 flex-1"
            >
              {editProps ? "Update Assessment" : "Create Assessment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
