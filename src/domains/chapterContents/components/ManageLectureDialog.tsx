import {
  useCreateLectureContent,
  useEditChapterContent,
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { toast } from "sonner";
import { api } from "@/utils/axiosBackend";
import DateTimePicker from "@/components/shared/form/DateTimePicker";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { formatToLocal, formatToUTC } from "@/utils/sharedFunctions";
import type { ChapterContent } from "@/domains/chapterContents/types";
import { useEffect } from "react";
import { useChapterContentInfo } from "../api/queries";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";

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
  });

export default function ManageLectureDialog({ chapterId, ...props }: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);
  const {
    mutateAsync: createLectureContent,
    status: createLectureContentStatus,
  } = useCreateLectureContent();

  const { mutateAsync: editLectureContent, status: editLectureContentStatus } =
    useEditChapterContent();

  usePendingOverlay({
    isPending: editLectureContentStatus === "pending",
    pendingLabel: "Editing Lecture",
  });

  usePendingOverlay({
    isPending: createLectureContentStatus === "pending",
    pendingLabel: "Creating Lecture",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      is_published: true,
      publishes_at: null,
      is_open: true,
      opens_at: null,
      closes_at: null,
    },
  });

  const editProps = props.type === "edit" ? props : null;

  const { data: chapterContentInfo, status: chapterContentInfoStatus } =
    useChapterContentInfo(editProps?.chapterContent.id);

  //this only runs if user wants to edit instead of create
  useEffect(() => {
    if (chapterContentInfo) {
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
      });
    }
  }, [chapterContentInfo]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("chapter_id", chapterId);
      formData.append("content_type", "lecture");
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

      if (editProps) {
        await editLectureContent({
          id: editProps.chapterContent.id,
          formData,
        });
      } else {
        await createLectureContent(formData);
      }
      toggleOpenDialog(null);
    } catch (error) {
      toast.error("An error occured.");
    }
  };

  const isPublished = form.watch("is_published");
  const isOpen = form.watch("is_open");
  const opensAt = form.watch("opens_at");

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
        {editProps ? "Update Lecture" : "Create new Lecture"}
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
                  <Input placeholder="Lecture Name" {...field} />
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
          <div className="flex gap-4">
            <div className="flex flex-col gap-6">
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

            <div className="flex flex-col gap-6">
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
              {editProps ? "Update Lecture" : "Create Lecture"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
