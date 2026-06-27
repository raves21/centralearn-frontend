import ErrorComponent from "@/components/shared/ErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { useAllAssessmentMaterials } from "@/domains/assessmentMaterials/api/queries";
import { useAttemptInfo } from "@/domains/studentAssessmentAttempts/api/queries";
import OngoingAttempt from "@/domains/studentAssessmentAttempts/components/OngoingAttempt";
import SubmittedAttempt from "@/domains/studentAssessmentAttempts/components/SubmittedAttempt";
import type { Answer } from "@/domains/studentAssessmentAttempts/types";
import { useRouteRoleGuard } from "@/utils/hooks/useRouteRoleGuard";
import { Role } from "@/utils/sharedTypes";
import { createFileRoute } from "@tanstack/react-router";

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
  } = useAttemptInfo(attemptId);

  const { data: assessmentMaterials, status: assessmentMaterialsStatus } =
    useAllAssessmentMaterials({
      assessmentId:
        studentAssessmentAttemptInfo?.assessmentResult.assessment.id,
    });

  if (
    [studentAssessmentAttemptStatus, assessmentMaterialsStatus].includes(
      "error",
    )
  ) {
    return <ErrorComponent />;
  }

  if (
    [studentAssessmentAttemptStatus, assessmentMaterialsStatus].includes(
      "pending",
    )
  ) {
    return <LoadingComponent />;
  }

  if (studentAssessmentAttemptInfo && assessmentMaterials) {
    const answersFromDb: Answer[] = studentAssessmentAttemptInfo.answers.map(
      (answer) => ({
        assessmentMaterialId: answer.asmt_material_id,
        content: answer.content,
        materialType: answer.material_type,
      }),
    );

    if (studentAssessmentAttemptInfo.status === "ongoing") {
      return (
        <OngoingAttempt
          studentAssessmentAttemptInfo={studentAssessmentAttemptInfo}
          classId={classId}
          questionnaireItems={assessmentMaterials}
          answersFromDb={answersFromDb}
          attemptId={attemptId}
          assessmentName={
            studentAssessmentAttemptInfo.assessmentResult.assessment.name
          }
          chapterName={
            studentAssessmentAttemptInfo.assessmentResult.assessment
              .chapterName!
          }
        />
      );
    } else {
      return (
        <SubmittedAttempt
          classId={classId}
          answersFromDb={answersFromDb}
          questionnaireItems={assessmentMaterials}
          submissionSummary={studentAssessmentAttemptInfo.submissionSummary!}
          attemptId={attemptId}
          assessmentName={
            studentAssessmentAttemptInfo.assessmentResult.assessment.name
          }
          chapterName={
            studentAssessmentAttemptInfo.assessmentResult.assessment
              .chapterName!
          }
        />
      );
    }
  }
}
