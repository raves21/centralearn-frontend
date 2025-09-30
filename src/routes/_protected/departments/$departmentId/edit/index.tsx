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
import { Textarea } from "@/components/ui/textarea";
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
import { useEditDepartment } from "@/domains/departments/api/mutations";
import { toast } from "sonner";
import { usePendingOverlay } from "@/components/shared/globals/pendingOverlay/usePendingOverlay";
import { useImageUploadState } from "@/utils/hooks/useImageUploadState";
import { useDepartmentInfo } from "@/domains/departments/api/queries";
import { Loader } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/_protected/departments/$departmentId/edit/"
)({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1, { error: "This field is required." }),
  code: z.string().min(1, { error: "This field is required." }),
  description: z.string().optional(),
});

function RouteComponent() {
  const { image, preview, setImage, setPreview } = useImageUploadState();
  const { departmentId } = Route.useParams();

  const navigate = useNavigate();
  const { mutateAsync: editDepartment, status: editDepartmentStatus } =
    useEditDepartment();

  usePendingOverlay({
    isPending: editDepartmentStatus === "pending",
    pendingLabel: "Updating Department",
  });

  const { data: departmentInfo, status: departmentInfoStatus } =
    useDepartmentInfo({ departmentId });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  useEffect(() => {
    if (departmentInfo) {
      form.reset({
        code: departmentInfo.code,
        description: departmentInfo.description || undefined,
        name: departmentInfo.name,
      });
      setPreview(departmentInfo.imageUrl);
    }
  }, [departmentInfo]);

  async function onSubmit({
    name,
    code,
    description,
  }: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("code", code);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);
      await editDepartment({ departmentId, payload: formData });
      navigate({ to: "/departments" });
    } catch (error) {
      toast.error("An error occured");
    }
  }

  if (departmentInfoStatus === "error") {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if (departmentInfoStatus === "pending") {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (departmentInfo) {
    return (
      <div className="flex flex-col gap-16 size-full">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate({ to: "/departments" })}
                >
                  Departments
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Edit Department</p>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-start w-full gap-10">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="shadow-none h-[200px] border-gray-400 resize-none focus-visible:ring-mainaccent focus-visible:border-none bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            </div>
            <div className="flex items-center gap-5">
              <button
                type="submit"
                className="flex hover:bg-indigo-800 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-2 py-[10px] text-white rounded-md bg-mainaccent"
              >
                Save
              </button>
              <button
                disabled={editDepartmentStatus === "pending"}
                onClick={() => navigate({ to: "/departments" })}
                type="button"
                className="flex disabled:bg-gray-200 hover:bg-gray-200 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-white border-2 border-gray-600/50 text-black"
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
