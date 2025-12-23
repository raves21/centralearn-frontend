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
import { useCreateDepartment } from "@/domains/departments/api/mutations";
import { toast } from "sonner";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import ErrorComponent from "@/components/shared/ErrorComponent";

export const Route = createFileRoute(
  "/_protected/admin-panel/departments/create/"
)({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1, { error: "This field is required." }),
  code: z.string().min(1, { error: "This field is required." }),
  description: z.string().optional(),
});

function RouteComponent() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const { mutateAsync: createDepartment, status: createDepartmentStatus } =
    useCreateDepartment();

  usePendingOverlay({
    isPending: createDepartmentStatus === "pending",
    pendingLabel: "Creating Department",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

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
      await createDepartment(formData);
      navigate({ to: "/admin-panel/departments" });
    } catch (error) {
      toast.error("An error occured");
    }
  }

  if (createDepartmentStatus === "error") {
    return <ErrorComponent />;
  }

  return (
    <div className="flex flex-col gap-16 size-full">
      <div className="flex flex-col gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate({ to: "/admin-panel/departments" })}
              >
                Departments
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-2xl font-bold">Create Department</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-8 pb-10"
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
              Create
            </button>
            <button
              disabled={createDepartmentStatus === "pending"}
              onClick={() => navigate({ to: "/admin-panel/departments" })}
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
