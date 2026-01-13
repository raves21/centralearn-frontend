import {
  useCreateAssessment,
  useEditAssessment,
} from "@/domains/chapterContents/api/mutations";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { toast } from "sonner";
import { api } from "@/utils/axiosBackend";
import DateTimePicker from "@/components/shared/form/DateTimePicker";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { formatToLocal, formatToUTC } from "@/utils/sharedFunctions";
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
    is_published: z.boolean(),
    publishes_at: z.date().optional().nullable(),
    is_open: z.boolean(),
    opens_at: z.date().optional().nullable(),
    closes_at: z.date().optional().nullable(),

    // Assessment specific
    time_limit: z.coerce
      .number()
      .int()
      .min(1, "Time limit must be at least 1 minute"),
    is_answers_viewable_after_submit: z.boolean(),
    is_score_viewable_after_submit: z.boolean(),
    is_multi_attempts: z.boolean(),
    max_attempts: z.coerce.number().optional().nullable(),
    multi_attempt_grading_type: z
      .enum(["avg_score", "highest_score"])
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // closes_at must only be set if opens_at has value.
    if (!data.opens_at && data.closes_at) {
      ctx.addIssue({
        code: "custom",
        message: "Closes At must only be set if Opens At has value.",
        path: ["closes_at"],
      });
    }

    // Validate closes_at is after opens_at
    if (data.opens_at && data.closes_at && data.closes_at <= data.opens_at) {
      ctx.addIssue({
        code: "custom",
        message: "Closes At must be after Opens At.",
        path: ["closes_at"],
      });
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
      is_published: true,
      publishes_at: null,
      is_open: true,
      opens_at: null,
      closes_at: null,
      time_limit: 60,
      is_answers_viewable_after_submit: true,
      is_score_viewable_after_submit: true,
      is_multi_attempts: false,
      max_attempts: 2,
      multi_attempt_grading_type: "highest_score",
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

      form.reset({
        name: chapterContentInfo.name,
        description: chapterContentInfo.description ?? "",
        publishes_at: chapterContentInfo.publishesAt
          ? new Date(formatToLocal(chapterContentInfo.publishesAt))
          : null,
        is_open: chapterContentInfo.isOpen,
        is_published: chapterContentInfo.isPublished,
        opens_at: chapterContentInfo.opensAt
          ? new Date(formatToLocal(chapterContentInfo.opensAt))
          : null,
        closes_at: chapterContentInfo.closesAt
          ? new Date(formatToLocal(chapterContentInfo.closesAt))
          : null,

        // Assessment specific
        time_limit: assessmentContent.timeLimit ?? 0,
        is_answers_viewable_after_submit:
          assessmentContent.isAnswersViewableAfterSubmit,
        is_score_viewable_after_submit:
          assessmentContent.isScoreViewableAfterSubmit,
        is_multi_attempts: assessmentContent.isMultiAttempts,
        max_attempts: assessmentContent.maxAttempts,
        multi_attempt_grading_type: assessmentContent.multiAttemptGradingType,
      });
    }
  }, [chapterContentInfo]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
          `/chapters/${chapterId}/content-count`
        );
        formData.append("order", (chapterContentCount + 1).toString());
      }

      if (data.is_published) {
        formData.append("publishes_at", formatToUTC(new Date()));
      } else if (data.publishes_at) {
        formData.append("publishes_at", formatToUTC(data.publishes_at));
      }

      if (data.is_open) {
        formData.append("opens_at", formatToUTC(new Date()));
      } else if (data.opens_at) {
        formData.append("opens_at", formatToUTC(data.opens_at));
      }

      if (data.closes_at) {
        formData.append("closes_at", formatToUTC(data.closes_at));
      }

      // Assessment specific form data
      // Using bracket notation for 'content' array as per PHP usually expecting this for nested creation/validation
      formData.append("content[time_limit]", data.time_limit.toString());
      formData.append(
        "content[is_answers_viewable_after_submit]",
        data.is_answers_viewable_after_submit ? "1" : "0"
      );
      formData.append(
        "content[is_score_viewable_after_submit]",
        data.is_score_viewable_after_submit ? "1" : "0"
      );
      formData.append(
        "content[is_multi_attempts]",
        data.is_multi_attempts ? "1" : "0"
      );

      if (data.is_multi_attempts) {
        if (data.max_attempts)
          formData.append(
            "content[max_attempts]",
            data.max_attempts.toString()
          );
        if (data.multi_attempt_grading_type)
          formData.append(
            "content[multi_attempt_grading_type]",
            data.multi_attempt_grading_type
          );
      } else {
        // Technically nullable if not multi-attempts, but let's ensure they are null or not sent?
        // Validation rules say "required_if:content.is_multi_attempts,true", implying optional otherwise.
        // We can skip appending them if they are not relevant.
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
  };

  const isPublished = form.watch("is_published");
  const isOpen = form.watch("is_open");
  const opensAt = form.watch("opens_at");
  const isMultiAttempts = form.watch("is_multi_attempts");

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
    <div className="w-[600px] bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto">
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="time_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            {isMultiAttempts && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="max_attempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Attempts</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={2}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-6 flex-1">
              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={() => {
                            field.onChange(!field.value);
                            form.setValue("publishes_at", null);
                            form.clearErrors("publishes_at");
                          }}
                          className="h-4 w-4 mt-1 cursor-pointer accent-mainaccent"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Published
                        </FormLabel>
                        <FormDescription>
                          Check to make this visible to students immediately.
                        </FormDescription>
                      </div>
                    </label>
                  </FormItem>
                )}
              />
              <div className="w-full">
                {!isPublished && (
                  <DateTimePicker
                    control={form.control as any}
                    name="publishes_at"
                    label="Publishes At"
                    minDateTime={new Date()}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              <FormField
                control={form.control}
                name="is_open"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={() => {
                            field.onChange(!field.value);
                            form.setValue("opens_at", null);
                            form.setValue("closes_at", null);
                            form.clearErrors("opens_at");
                            form.clearErrors("closes_at");
                          }}
                          className="h-4 w-4 mt-1 cursor-pointer accent-mainaccent"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">Open</FormLabel>
                        <FormDescription>
                          Check to make this open to students immediately.
                        </FormDescription>
                      </div>
                    </label>
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-col gap-5">
                {!isOpen && (
                  <DateTimePicker
                    control={form.control as any}
                    name="opens_at"
                    label="Opens At"
                    minDateTime={new Date()}
                  />
                )}
                {(isOpen || !!opensAt) && (
                  <DateTimePicker
                    control={form.control as any}
                    name="closes_at"
                    label="Closes At"
                    minDateTime={opensAt ?? undefined}
                  />
                )}
              </div>
            </div>
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
