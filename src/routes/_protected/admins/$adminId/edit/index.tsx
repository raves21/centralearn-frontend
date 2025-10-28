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
import { useEditAdmin } from "@/domains/admins/api/mutations";
import { useAdminInfo } from "@/domains/admins/api/queries";
import { Loader } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_protected/admins/$adminId/edit/")({
  component: RouteComponent,
});

const formSchema = z.object({
  firstName: z.string().min(1, { error: "This field is required." }),
  lastName: z.string().min(1, { error: "This field is required." }),
  address: z.string().min(1, { error: "This field is required." }),
  jobTitle: z.string().min(1, { error: "This field is required." }),
  email: z.email().min(1, { error: "This field is required." }),
  password: z.string().refine((val) => val === "" || val.length >= 8, {
    message: "Must be at least 8 characters or empty",
  }),
});

function RouteComponent() {
  const { adminId } = Route.useParams();
  const navigate = useNavigate();
  const { mutateAsync: editAdmin, status: editAdminStatus } = useEditAdmin();

  const { data: adminInfo, status: adminInfoStatus } = useAdminInfo(adminId);

  usePendingOverlay({
    isPending: editAdminStatus === "pending",
    pendingLabel: "Updating Admin",
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

  useEffect(() => {
    if (adminInfo) {
      form.reset({
        address: adminInfo.user.address,
        email: adminInfo.user.email,
        firstName: adminInfo.user.firstName,
        jobTitle: adminInfo.jobTitle,
        lastName: adminInfo.user.lastName,
        password: "",
      });
    }
  }, [adminInfo]);

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
      await editAdmin({ id: adminId, formData });
      navigate({ to: "/admins" });
    } catch (error) {
      toast.error("An error occured");
    }
  }

  if (adminInfoStatus === "error") {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if (adminInfoStatus === "pending") {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (adminInfo) {
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
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Edit Admin</p>
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
                Save
              </button>
              <button
                disabled={editAdminStatus === "pending"}
                onClick={() => navigate({ to: "/admins" })}
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
}
