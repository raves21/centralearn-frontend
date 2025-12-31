import { useCreateLectureContent } from "@/domains/chapterContents/api/mutations";
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
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { toast } from "sonner";
import { api } from "@/utils/axiosBackend";
import DateTimePicker from "@/components/shared/form/DateTimePicker";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { getDateTimeFormat } from "@/utils/sharedFunctions";

type Props = {
  chapterId: string;
};

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
    // published_at can only be set if not published
    if (data.is_published && data.publishes_at) {
      ctx.addIssue({
        code: "custom",
        message:
          "Publishes at can only be set if the content is not yet published.",
        path: ["publishes_at"],
      });
    }

    // opens_at can only be set if not open
    if (data.is_open && data.opens_at) {
      ctx.addIssue({
        code: "custom",
        message: "Opens at can only be set if the content is not already open.",
        path: ["opens_at"],
      });
    }

    // closes_at must only be set if content is already open, or if opens_at has value.
    if (!data.is_open && !data.opens_at && data.closes_at) {
      ctx.addIssue({
        code: "custom",
        message:
          "Closes at must only be set if content is already open, or if opens_at has value.",
        path: ["closes_at"],
      });
    }

    // Validate closes_at is after opens_at
    if (data.opens_at && data.closes_at && data.closes_at <= data.opens_at) {
      ctx.addIssue({
        code: "custom",
        message: "Closes at must be after Opens at.",
        path: ["closes_at"],
      });
    }

    // Validate opens_at is after or equal to today
    if (data.opens_at) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      if (data.opens_at < today) {
        ctx.addIssue({
          code: "custom",
          message: "Opens at must be today or in the future.",
          path: ["opens_at"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function CreateLectureDialog({ chapterId }: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);
  const {
    mutateAsync: createLectureContent,
    status: createLectureContentStatus,
  } = useCreateLectureContent();

  usePendingOverlay({
    isPending: createLectureContentStatus === "pending",
    pendingLabel: "Creating Lecture",
  });

  const form = useForm<FormValues>({
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

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: chapterContentCount } = await api.get(
        `/chapters/${chapterId}/content-count`
      );
      const formData = new FormData();
      formData.append("chapter_id", chapterId);
      formData.append("content_type", "lecture");
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("order", (chapterContentCount + 1).toString());

      if (data.is_published) {
        formData.append(
          "publishes_at",
          format(new Date(), getDateTimeFormat())
        );
      } else if (data.publishes_at) {
        formData.append(
          "publishes_at",
          format(data.publishes_at, getDateTimeFormat())
        );
      }

      if (data.is_open) {
        formData.append("opens_at", format(new Date(), getDateTimeFormat()));
      } else if (data.opens_at) {
        formData.append("opens_at", format(data.opens_at, getDateTimeFormat()));
      }

      if (data.closes_at) {
        formData.append(
          "closes_at",
          format(data.closes_at, getDateTimeFormat())
        );
      }
      await createLectureContent(formData);
      toggleOpenDialog(null);
    } catch (error) {
      toast.error("An error occured.");
    }
  };

  const isPublished = form.watch("is_published");
  const isOpen = form.watch("is_open");
  const opensAt = form.watch("opens_at");

  return (
    <div className="w-[600px] bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Create new Lecture</h2>
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
                        onChange={field.onChange}
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
                        onChange={field.onChange}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            {!isPublished && (
              <DateTimePicker
                control={form.control as any}
                name="publishes_at"
                label="Publishes At"
              />
            )}
            {!isOpen && (
              <DateTimePicker
                control={form.control as any}
                name="opens_at"
                label="Opens At"
              />
            )}
            {(isOpen || !!opensAt) && (
              <DateTimePicker
                control={form.control as any}
                name="closes_at"
                label="Closes At"
              />
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
              Create Lecture
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
