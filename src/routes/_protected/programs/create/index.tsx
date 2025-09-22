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
import { useCreateProgram } from "@/domains/programs/api/queries";
import { usePendingOverlay } from "@/components/shared/globals/pendingOverlay/usePendingOverlay";
import { useMemo, useState, type ReactNode } from "react";
import ProgramInfoForm from "@/domains/programs/components/createProgramFormSteps/ProgramInfoForm";
import { Loader } from "lucide-react";
import { useGetAllDepartments } from "@/domains/departments/api/queries";
import MultiStepFormContainer from "@/components/shared/form/MultiStepFormContainer";
import AssignToDepartmentForm from "@/domains/programs/components/createProgramFormSteps/AssignToDepartmentForm";
import { toast } from "sonner";

export const Route = createFileRoute("/_protected/programs/create/")({
  component: RouteComponent,
});

const step1Schema = z.object({
  name: z.string().min(1, "This field is required."),
  code: z.string().min(1, "This field is required."),
  description: z.string().optional(),
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
  component: ReactNode;
};

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const { mutateAsync: createProgram, status: createProgramStatus } =
    useCreateProgram();

  const { data: departments, status: getAllDepartmentsStatus } =
    useGetAllDepartments({});

  usePendingOverlay({
    isPending: createProgramStatus === "pending",
    pendingLabel: "Creating Program",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      step1: {
        code: "",
        description: "",
        name: "",
      },
      step2: {
        departmentId: null,
      },
    },
  });

  async function nextStep() {
    const currentStepFields = stepFields[currentStep];
    const isValid = await form.trigger(currentStepFields.step);
    if (isValid) setCurrentStep((prev) => prev + 1);
  }

  function prevStep() {
    setCurrentStep((prev) => prev - 1);
  }

  const stepFields = useMemo(
    (): Record<number, StepField> => ({
      1: {
        label: "Program Info",
        step: "step1",
        component: (
          <ProgramInfoForm
            imageProps={{
              image,
              preview,
              setImage,
              setPreview,
            }}
            onNext={nextStep}
          />
        ),
      },
      2: {
        label: "Assign to Department",
        step: "step2",
        component: (
          <AssignToDepartmentForm departments={departments} onPrev={prevStep} />
        ),
      },
    }),
    [departments, image, preview]
  );

  async function onSubmit({
    step1: { code, name, description },
    step2: { departmentId },
  }: TFormSchema) {
    let formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    if (description) {
      formData.append("description", description);
    }
    if (image) {
      formData.append("image", image);
    }
    formData.append("department_id", departmentId!);

    try {
      await createProgram(formData);
      navigate({ to: "/programs" });
    } catch (error) {
      toast.error("An error occured.");
    }
  }

  const stepFieldEntries = Object.entries(stepFields);

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
                <Link to="/programs">Programs</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Create Program</p>
        </div>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-12">
              <MultiStepFormContainer
                currentStep={currentStep}
                stepFieldEntries={stepFieldEntries}
              >
                {stepFields[currentStep].component}
              </MultiStepFormContainer>
            </form>
          </Form>
        </FormProvider>
      </div>
    );
  }
}
