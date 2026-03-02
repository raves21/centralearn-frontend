import ErrorComponent from "@/components/shared/ErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useStudentAssessmentAttemptInfo } from "@/domains/studentAssessmentAttempts/api/queries";
import Questionnaire from "@/domains/studentAssessmentAttempts/components/Questionnaire";
import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute, Link } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId_/contents/attempt/$attemptId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  useRouteRoleGuard({
    allowedRoles: [Role.STUDENT],
  });

  const { attemptId, classId } = Route.useParams();

  const {
    data: studentAssessmentAttemptInfo,
    status: studentAssessmentAttemptStatus,
  } = useStudentAssessmentAttemptInfo(attemptId);

  if ([studentAssessmentAttemptStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([studentAssessmentAttemptStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (studentAssessmentAttemptInfo) {
    const assessment = studentAssessmentAttemptInfo.assessment;
    const chapterContent = assessment.chapterContent;
    const chapter = chapterContent.chapter;
    return (
      <div className="flex flex-col gap-12 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Link
                      to="/lms/classes/$classId"
                      params={{
                        classId,
                      }}
                    >
                      {chapter.name}
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{chapterContent.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              <NotebookPen className="size-8" />
              <p className="text-2xl font-bold">{chapterContent.name}</p>
              {assessment.maxAchievableScore && (
                <div className="px-3 py-2 ml-3 rounded-md border border-mainaccent text-mainaccent font-semibold text-lg">
                  {assessment.maxAchievableScore}{" "}
                  {assessment.maxAchievableScore === 1 ? "point" : "points"}
                </div>
              )}
            </div>
          </div>
          {/* <button
            onClick={() =>
              navigate({
                to: "/lms/classes/$classId/contents/$chapterContentId/edit",
                params: {
                  chapterContentId,
                  classId,
                },
              })
            }
            className="px-4 py-2 rounded-md bg-mainaccent text-white flex items-center gap-3"
          >
            <Edit className="size-4" />
            <p>Enter edit mode</p>
          </button> */}
        </div>
        <Questionnaire
          questionnaireSnapshot={
            studentAssessmentAttemptInfo.data.assessmentVersion
              .questionnaireSnapshot
          }
        />
      </div>
    );
  }
}
