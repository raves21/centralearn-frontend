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
import { usePendingOverlay } from "@/components/shared/globals/pendingOverlay/usePendingOverlay";
import { useCreateAdmin } from "@/domains/admins/api/mutations";

export const Route = createFileRoute("/_protected/admins/create/")({
  component: RouteComponent,
});

const formSchema = z.object({
  firstName: z.string().min(1, { error: "This field is required." }),
  lastName: z.string().min(1, { error: "This field is required." }),
  address: z.string().min(1, { error: "This field is required." }),
  jobTitle: z.string().min(1, { error: "This field is required." }),
  email: z.email().min(1, { error: "This field is required." }),
  password: z.string().min(8, { error: "This field is required." }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutateAsync: createAdmin, status: createAdminStatus } =
    useCreateAdmin();

  usePendingOverlay({
    isPending: createAdminStatus === "pending",
    pendingLabel: "Creating Admin",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      email: "",
      firstName: "",
      jobTitle: "",
      lastName: "",
      password: "",
    },
  });

  async function onSubmit({
    address,
    email,
    firstName,
    jobTitle,
    lastName,
    password,
  }: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("address", address);
      formData.append("job_title", jobTitle);
      formData.append("password", password);
      formData.append("email", email);
      await createAdmin(formData);
      navigate({ to: "/admins" });
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
              <BreadcrumbLink onClick={() => navigate({ to: "/admins" })}>
                Admins
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-2xl font-bold">Create Admin</p>
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
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      First Name <span className="text-red-500">*</span>
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full gap-10">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Address <span className="text-red-500">*</span>
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
                name="jobTitle"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Job Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full gap-10">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
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
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
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
              disabled={createAdminStatus === "pending"}
              onClick={() => navigate({ to: "/admins" })}
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
