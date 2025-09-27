import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePendingOverlay } from "@/components/shared/globals/pendingOverlay/usePendingOverlay";
import { Loader } from "lucide-react";
import MultiStepFormContainer from "@/components/shared/form/MultiStepFormContainer";
import { toast } from "sonner";
import { useMultiStepFormState } from "@/utils/hooks/useMultiStepFormState";
import { useCreateInstructor } from "@/domains/instructors/api/mutations";
import { useAllDepartments } from "@/domains/departments/api/queries";
import AssignToDepartmentForm from "@/domains/programs/components/createProgramFormSteps/AssignToDepartmentForm";
import InstructorInfoForm from "@/domains/instructors/components/createInstructorFormSteps/InstructorInfoForm";

export const Route = createFileRoute("/_protected/instructors/create/")({
  component: RouteComponent,
});

const step1Schema = z.object({
  firstName: z.string().min(1, { error: "This field is required." }),
  lastName: z.string().min(1, { error: "This field is required." }),
  address: z.string().min(1, { error: "This field is required." }),
  jobTitle: z.string().min(1, { error: "This field is required." }),
  email: z.email().min(1, { error: "This field is required." }),
  isAdmin: z.boolean(),
  password: z.string().min(8, { error: "Minimum of 8 characters." }),
});

const step2Schema = z.object({
  departmentId: z
    .string()
    .nullable()
    .refine((val) => val !== null, { error: "This field is required." }),
});

const formSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
});

type TFormSchema = z.infer<typeof formSchema>;

type StepField = {
  step: keyof TFormSchema;
  label: string;
};

const formSteps: Record<number, StepField> = {
  1: {
    label: "Instructor Info",
    step: "step1",
  },
  2: {
    label: "Assign to Department",
    step: "step2",
  },
};

function RouteComponent() {
  const navigate = useNavigate();

  const { mutateAsync: createInstructor, status: createInstructorStatus } =
    useCreateInstructor();

  const { data: departments, status: getAllDepartmentsStatus } =
    useAllDepartments({});

  usePendingOverlay({
    isPending: createInstructorStatus === "pending",
    pendingLabel: "Creating Instructor",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      step1: {
        address: "",
        email: "",
        jobTitle: "",
        firstName: "",
        lastName: "",
        password: "",
        isAdmin: false,
      },
      step2: {
        departmentId: null,
      },
    },
  });

  const { currentStep, nextStep, prevStep } = useMultiStepFormState({
    formSteps,
    form,
  });

  async function onSubmit({
    step1: { address, email, firstName, lastName, password, jobTitle, isAdmin },
    step2: { departmentId },
  }: TFormSchema) {
    let formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("job_title", jobTitle);
    formData.append("is_admin", Number(isAdmin).toString());
    formData.append("department_id", departmentId!);

    try {
      await createInstructor(formData);
      navigate({ to: "/instructors" });
    } catch (error) {
      toast.error("An error occured.");
    }
  }

  const formStepEntries = Object.entries(formSteps);

  if (getAllDepartmentsStatus === "error") {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if (getAllDepartmentsStatus === "pending") {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (departments) {
    return (
      <div className="flex flex-col gap-8 size-full">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/instructors">Instructors</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Create Instructor </p>
        </div>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-12">
              <MultiStepFormContainer
                currentStep={currentStep}
                formStepEntries={formStepEntries}
              >
                {currentStep === 1 && <InstructorInfoForm onNext={nextStep} />}
                {currentStep === 2 && (
                  <AssignToDepartmentForm
                    departments={departments}
                    onPrev={prevStep}
                  />
                )}
              </MultiStepFormContainer>
            </form>
          </Form>
        </FormProvider>
      </div>
    );
  }
}
