import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { useCreateSection } from "@/domains/sections/api/mutations";

export const Route = createFileRoute("/_protected/sections/create/")({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1, { error: "This field is required." }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutateAsync: createSection, status: createSectionStatus } =
    useCreateSection();

  usePendingOverlay({
    isPending: createSectionStatus === "pending",
    pendingLabel: "Creating Section",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit({ name }: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      await createSection(formData);
      navigate({ to: "/sections" });
    } catch (error) {
      toast.error("An error occured");
    }
  }

  return (
    <div className="flex flex-col gap-16 size-full">
      <div className="flex flex-col gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate({ to: "/sections" })}>
                Sections
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-2xl font-bold">Create Section</p>
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
              disabled={createSectionStatus === "pending"}
              onClick={() => navigate({ to: "/sections" })}
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
