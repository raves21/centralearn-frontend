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
import { useGetAllDepartments } from "@/domains/departments/api/queries";
import MultiStepFormContainer from "@/components/shared/form/MultiStepFormContainer";
import { toast } from "sonner";
import { useImageUploadState } from "@/utils/hooks/useImageUploadState";
import { useMultiStepFormState } from "@/utils/hooks/useMultiStepFormState";
import { useCreateCourse } from "@/domains/courses/api/mutations";
import CourseInfoForm from "@/domains/courses/components/createCourseFormSteps/CourseInfoForm";
import AssignToDepartmentsForm from "@/domains/courses/components/createCourseFormSteps/AssignToDepartmentsForm";

export const Route = createFileRoute("/_protected/courses/create/")({
  component: RouteComponent,
});

const step1Schema = z.object({
  name: z.string().min(1, "This field is required."),
  code: z.string().min(1, "This field is required."),
  description: z.string().optional(),
});

const step2Schema = z.object({
  departments: z.array(z.string()).min(1, { error: "This field is required." }),
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
    label: "Course Info",
    step: "step1",
  },
  2: {
    label: "Assign to Department/s",
    step: "step2",
  },
};

function RouteComponent() {
  const { image, preview, setImage, setPreview } = useImageUploadState();

  const navigate = useNavigate();

  const { mutateAsync: createCourse, status: createCourseStatus } =
    useCreateCourse();

  const { data: departments, status: getAllDepartmentsStatus } =
    useGetAllDepartments({});

  usePendingOverlay({
    isPending: createCourseStatus === "pending",
    pendingLabel: "Creating Course",
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
        departments: [],
      },
    },
  });

  const { currentStep, nextStep, prevStep } = useMultiStepFormState({
    formSteps,
    form,
  });

  async function onSubmit({
    step1: { code, name, description },
    step2: { departments },
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

    departments!.forEach((deptId) => {
      formData.append("departments[]", deptId);
    });

    try {
      await createCourse(formData);
      navigate({ to: "/courses" });
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
                <Link to="/programs">Programs</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Create Course</p>
        </div>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-12">
              <MultiStepFormContainer
                currentStep={currentStep}
                formStepEntries={formStepEntries}
              >
                {currentStep === 1 && (
                  <CourseInfoForm
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
                  <AssignToDepartmentsForm
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
