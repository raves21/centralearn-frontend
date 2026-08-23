import {
  useCreateLecture,
  useEditLecture,
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
    accessibility_type: z.enum(["visible", "hidden", "custom"]),
    access_from: z.date().optional().nullable(),
    access_until: z.date().optional().nullable(),
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
      if (data.access_from && data.access_until && data.access_until <= data.access_from) {
        ctx.addIssue({
          code: "custom",
          message: "Access Until must be after Access From.",
          path: ["access_until"],
        });
      }
    }
  });

export default function ManageLectureDialog({ chapterId, ...props }: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);
  const {
    mutateAsync: createLectureContent,
    status: createLectureContentStatus,
  } = useCreateLecture();

  const { mutateAsync: editLectureContent, status: editLectureContentStatus } =
    useEditLecture();

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
      accessibility_type: "hidden",
      access_from: null,
      access_until: null,
    },
  });

  const editProps = props.type === "edit" ? props : null;

  const { data: chapterContentInfo, status: chapterContentInfoStatus } =
    useChapterContentInfo(editProps?.chapterContent.id);

  //this only runs if user wants to edit instead of create
  useEffect(() => {
    if (chapterContentInfo) {
      let type: "visible" | "hidden" | "custom" = "hidden";
      let accessFrom = null;
      let accessUntil = null;

      const settings = chapterContentInfo.accessibilitySettings;
      if (settings) {
        if (settings.visible === true) type = "visible";
        else if (settings.visible === false) type = "hidden";
        else if (settings.custom) {
          type = "custom";
          accessFrom = settings.custom.access_from ? new Date(formatToLocal(settings.custom.access_from)) : null;
          accessUntil = settings.custom.access_until ? new Date(formatToLocal(settings.custom.access_until)) : null;
        }
      }

      form.reset({
        name: chapterContentInfo.name,
        description: chapterContentInfo.description ?? "",
        accessibility_type: type,
        access_from: accessFrom,
        access_until: accessUntil,
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

      if (data.accessibility_type === "visible") {
        formData.append("accessibility_settings[visible]", "1");
      } else if (data.accessibility_type === "hidden") {
        formData.append("accessibility_settings[visible]", "0");
      } else if (data.accessibility_type === "custom") {
        if (data.access_from) {
          formData.append("accessibility_settings[custom][access_from]", formatToUTC(data.access_from));
        }
        if (data.access_until) {
          formData.append("accessibility_settings[custom][access_until]", formatToUTC(data.access_until));
        }
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

  const accessibilityType = form.watch("accessibility_type");
  const accessFrom = form.watch("access_from");

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
          <div className="flex flex-col text-sm gap-4 p-4 border rounded-md">
            <h3 className="font-semibold mb-2">Accessibility Settings</h3>
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
                      <SelectItem value="custom">Custom Access Period</SelectItem>
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
              {editProps ? "Update Lecture" : "Create Lecture"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
