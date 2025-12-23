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
import ProgramInfoForm from "@/domains/programs/components/createEditProgramFormSteps/ProgramInfoForm";
import { useAllDepartments } from "@/domains/departments/api/queries";
import MultiStepFormContainer from "@/components/shared/form/MultiStepFormContainer";
import AssignToDepartmentForm from "@/domains/programs/components/createEditProgramFormSteps/AssignToDepartmentForm";
import { toast } from "sonner";
import { useEditProgram } from "@/domains/programs/api/mutations";
import { useImageUploadState } from "@/utils/hooks/useImageUploadState";
import { useMultiStepFormState } from "@/utils/hooks/useMultiStepFormState";
import { useEffect } from "react";
import { useProgramInfo } from "@/domains/programs/api/queries";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";

export const Route = createFileRoute(
  "/_protected/admin-panel/programs/$programId/edit/"
)({
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
};

const formSteps: Record<number, StepField> = {
  1: {
    label: "Program Info",
    step: "step1",
  },
  2: {
    label: "Assign to Department",
    step: "step2",
  },
};

function RouteComponent() {
  const { image, preview, setImage, setPreview } = useImageUploadState();
  const { programId } = Route.useParams();

  const navigate = useNavigate();

  const { data: programInfo, status: programInfoStatus } = useProgramInfo({
    programId,
  });

  const { mutateAsync: editProgram, status: editProgramStatus } =
    useEditProgram();

  const { data: departments, status: getAllDepartmentsStatus } =
    useAllDepartments({});

  usePendingOverlay({
    isPending: editProgramStatus === "pending",
    pendingLabel: "Updating Program",
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

  useEffect(() => {
    if (programInfo) {
      form.reset({
        step1: {
          code: programInfo.code,
          description: programInfo.description || undefined,
          name: programInfo.name,
        },
        step2: {
          departmentId: programInfo.department.id,
        },
      });
      setPreview(programInfo.imageUrl);
    }
  }, [programInfo]);

  const { currentStep, nextStep, prevStep } = useMultiStepFormState({
    formSteps,
    form,
  });

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
      await editProgram({ programId, payload: formData });
      navigate({ to: "/admin-panel/programs" });
    } catch (error) {
      toast.error("An error occured.");
    }
  }

  const formStepEntries = Object.entries(formSteps);

  if ([getAllDepartmentsStatus, programInfoStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([getAllDepartmentsStatus, programInfoStatus].includes("error")) {
    return <LoadingComponent />;
  }

  if (departments && programInfoStatus) {
    return (
      <div className="flex flex-col gap-8 size-full">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/admin-panel/programs">Programs</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Edit Program</p>
        </div>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-12">
              <MultiStepFormContainer
                currentStep={currentStep}
                formStepEntries={formStepEntries}
              >
                {currentStep === 1 && (
                  <ProgramInfoForm
                    imageProps={{
                      image,
                      preview,
                      setImage,
                      setPreview,
                    }}
                    onNext={nextStep}
                  />
                )}
                {currentStep === 2 && (
                  <AssignToDepartmentForm
                    type="edit"
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
