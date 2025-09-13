import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useLogin } from "../../../domains/auth/api/mutations";
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

export const Route = createFileRoute("/_unprotected/login/")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email({ error: "Email is badly formatted." }),
  password: z.string().min(1, { error: "This field is required." }),
});

function RouteComponent() {
  const { mutateAsync: login, status: loginStatus } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    try {
      await login({ email, password });
      toast.success("You are logged in!");
    } catch (err: any) {
      toast.error("Error", {
        description: err.response.data.message,
      });
    }
  }

  return (
    <div className="relative flex items-center justify-center max-w-full min-h-dvh w-dvw bg-main-bg">
      <div className="flex flex-col items-center gap-10  w-[400px] rounded-md">
        <div className="flex items-center justify-center gap-2">
          <Loader className="size-11 stroke-mainaccent" />
          <p className="text-3xl font-semibold">CentraLearn</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              type="submit"
              disabled={loginStatus === "pending"}
              className="flex items-center justify-center w-full gap-4 py-3 text-white rounded-md hover:cursor-pointer disabled:hover:cursor-auto disabled:bg-mainaccent-disabled bg-mainaccent"
            >
              {loginStatus === "pending" ? (
                <Loader className="animate-spin" />
              ) : (
                <p>Login</p>
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
