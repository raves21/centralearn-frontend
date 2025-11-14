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
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { Loader } from "lucide-react";
import MultiStepFormContainer from "@/components/shared/form/MultiStepFormContainer";
import { toast } from "sonner";
import { useMultiStepFormState } from "@/utils/hooks/useMultiStepFormState";
import { useAllPrograms } from "@/domains/programs/api/queries";
import { useCreateStudent } from "@/domains/students/api/mutations";
import StudentInfoForm from "@/domains/students/components/createEditStudentFormSteps/StudentInfoForm";
import AssignToProgramForm from "@/domains/students/components/createEditStudentFormSteps/AssignToProgramForm";

export const Route = createFileRoute(
  "/_protected/admin-panel/students/create/"
)({
  component: RouteComponent,
});

const step1Schema = z.object({
  firstName: z.string().min(1, { error: "This field is required." }),
  lastName: z.string().min(1, { error: "This field is required." }),
  address: z.string().min(1, { error: "This field is required." }),
  email: z.email().min(1, { error: "This field is required." }),
  password: z.string().min(8, { error: "Minimum of 8 characters" }),
});

const step2Schema = z.object({
  programId: z
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
    label: "Student Info",
    step: "step1",
  },
  2: {
    label: "Assign to Program",
    step: "step2",
  },
};

function RouteComponent() {
  const navigate = useNavigate();

  const { mutateAsync: createStudent, status: createStudentStatus } =
    useCreateStudent();

  const { data: programs, status: getAllProgramsStatus } = useAllPrograms({});

  usePendingOverlay({
    isPending: createStudentStatus === "pending",
    pendingLabel: "Creating Student",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      step1: {
        address: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
      },
      step2: {
        programId: null,
      },
    },
  });

  const { currentStep, nextStep, prevStep } = useMultiStepFormState({
    formSteps,
    form,
  });

  async function onSubmit({
    step1: { address, email, firstName, lastName, password },
    step2: { programId },
  }: TFormSchema) {
    let formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("program_id", programId!);

    try {
      await createStudent(formData);
      navigate({ to: "/admin-panel/students" });
    } catch (error) {
      toast.error("An error occured.");
    }
  }

  const formStepEntries = Object.entries(formSteps);

  if (getAllProgramsStatus === "error") {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if (getAllProgramsStatus === "pending") {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (programs) {
    return (
      <div className="flex flex-col gap-8 size-full">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/admin-panel/students">Students</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Create Student </p>
        </div>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-12">
              <MultiStepFormContainer
                currentStep={currentStep}
                formStepEntries={formStepEntries}
              >
                {currentStep === 1 && <StudentInfoForm onNext={nextStep} />}
                {currentStep === 2 && (
                  <AssignToProgramForm
                    type="create"
                    programs={programs}
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
