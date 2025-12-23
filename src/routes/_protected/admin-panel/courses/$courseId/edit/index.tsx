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
import { useAllDepartments } from "@/domains/departments/api/queries";
import MultiStepFormContainer from "@/components/shared/form/MultiStepFormContainer";
import { toast } from "sonner";
import { useImageUploadState } from "@/utils/hooks/useImageUploadState";
import { useMultiStepFormState } from "@/utils/hooks/useMultiStepFormState";
import { useEditCourse } from "@/domains/courses/api/mutations";
import CourseInfoForm from "@/domains/courses/components/createEditCourseFormSteps/CourseInfoForm";
import AssignToDepartmentsForm from "@/domains/courses/components/createEditCourseFormSteps/AssignToDepartmentsForm";
import { useCourseInfo } from "@/domains/courses/api/queries";
import { useEffect } from "react";
import { isArrayEqualRegardlessOfOrder } from "@/utils/sharedFunctions";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";

export const Route = createFileRoute(
  "/_protected/admin-panel/courses/$courseId/edit/"
)({
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
  const { courseId } = Route.useParams();
  const { image, preview, setImage, setPreview } = useImageUploadState();

  const navigate = useNavigate();

  const { mutateAsync: editCourse, status: editCourseStatus } = useEditCourse();

  const { data: courseInfo, status: courseInfoStatus } =
    useCourseInfo(courseId);

  const { data: departments, status: getAllDepartmentsStatus } =
    useAllDepartments({});

  usePendingOverlay({
    isPending: editCourseStatus === "pending",
    pendingLabel: "Updating Course",
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

  useEffect(() => {
    if (courseInfo) {
      form.reset({
        step1: {
          code: courseInfo.code,
          description: courseInfo.description ?? undefined,
          name: courseInfo.name,
        },
        step2: {
          departments: courseInfo.departments.map((dept) => dept.id),
        },
      });
      setPreview(courseInfo.imageUrl);
    }
  }, [courseInfo]);

  const { currentStep, nextStep, prevStep } = useMultiStepFormState({
    formSteps,
    form,
  });

  async function onSubmit({
    step1: { code, name, description },
    step2: { departments },
  }: TFormSchema) {
    if (!courseInfo) return;
    let formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    if (description) {
      formData.append("description", description);
    }

    if (courseInfo && courseInfo.imageUrl && !preview) {
      formData.append("image", "__DELETED__");
    } else {
      if (image) {
        formData.append("image", image);
      }
    }

    if (
      !isArrayEqualRegardlessOfOrder(
        departments,
        courseInfo.departments.map((dept) => dept.id)
      )
    ) {
      departments!.forEach((deptId) => {
        formData.append("departments[]", deptId);
      });
    }

    try {
      await editCourse({ courseId, payload: formData });
      toast.success("Saved.");
      navigate({ to: "/admin-panel/courses" });
    } catch (error) {
      toast.error("An error occured.");
    }
  }

  const formStepEntries = Object.entries(formSteps);

  if ([getAllDepartmentsStatus, courseInfoStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([getAllDepartmentsStatus, courseInfoStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (departments && courseInfoStatus) {
    return (
      <div className="flex flex-col gap-8 size-full">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/admin-panel/courses">Courses</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-2xl font-bold">Edit Course</p>
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
