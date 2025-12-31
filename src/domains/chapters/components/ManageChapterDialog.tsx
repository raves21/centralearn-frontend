import {
  useCreateChapter,
  useEditChapter,
} from "@/domains/chapters/api/mutations";
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
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { getDateTimeFormat } from "@/utils/sharedFunctions";
import { api } from "@/utils/axiosBackend";
import { useEffect } from "react";
import { useChapterInfo } from "../api/queries";

type EditProps = {
  chapterId: string;
  type: "edit";
  data: {
    name: string;
    description: string | null;
    published_at: Date | null;
    order: number;
  };
};

type CreatProps = {
  type: "create";
};

type Props = {
  classId: string;
} & (EditProps | CreatProps);

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  published_at: z.date().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ManageChapterDialog(props: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);
  const { mutateAsync: createChapter, status: createChapterStatus } =
    useCreateChapter();

  const { mutateAsync: updateChapter, status: updateChapterStatus } =
    useEditChapter();

  usePendingOverlay({
    isPending: createChapterStatus === "pending",
    pendingLabel: "Creating Chapter",
  });

  usePendingOverlay({
    isPending: updateChapterStatus === "pending",
    pendingLabel: "Updating Chapter",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      published_at: null,
    },
  });

  const { classId } = props;

  const editProps = props.type === "edit" ? props : null;

  const { data: chapterInfo } = useChapterInfo(editProps?.chapterId);

  useEffect(() => {
    if (chapterInfo && editProps) {
      const { description, name, published_at } = editProps.data;
      form.reset({
        name,
        description,
        published_at,
      });
    }
  }, [chapterInfo]);

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: courseClassChapterCount } = await api.get(
        `/course-classes/${classId}/chapter-count`
      );
      const formData = new FormData();
      formData.append("course_class_id", classId);
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);

      if (editProps) {
        formData.append("order", editProps.data.order.toString());
      } else {
        formData.append("order", (courseClassChapterCount + 1).toString());
      }

      if (data.published_at) {
        formData.append(
          "published_at",
          format(data.published_at, getDateTimeFormat())
        );
      } else {
        formData.append("published_at", "");
      }

      if (editProps) {
        await updateChapter({ id: editProps.chapterId, formData });
      } else {
        await createChapter(formData);
      }
      toggleOpenDialog(null);
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="w-[600px] bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">
        {editProps ? "Edit Chapter" : "Create new Chapter"}
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
                  <Input placeholder="Chapter Name" {...field} />
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
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published_at"
            render={({ field }) => (
              <FormItem>
                <label className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={!!field.value}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? new Date() : null)
                      }
                      className="h-4 w-4 mt-1 cursor-pointer accent-mainaccent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">Published</FormLabel>
                    <FormDescription>
                      Check to make this visible to students immediately.
                    </FormDescription>
                  </div>
                </label>
              </FormItem>
            )}
          />
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
              {editProps ? "Save changes" : "Create Chapter"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
