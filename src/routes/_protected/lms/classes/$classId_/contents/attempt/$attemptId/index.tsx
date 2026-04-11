import ErrorComponent from "@/components/shared/ErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
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

  if ([studentAssessmentAttemptStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([studentAssessmentAttemptStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (studentAssessmentAttemptInfo) {
    const answersFromDb: Answer[] =
      studentAssessmentAttemptInfo.data.answers.map((answer) => ({
        assessmentMaterialId: answer.asmt_material_id,
        content: answer.content,
        materialType: answer.material_type,
      }));

    if (studentAssessmentAttemptInfo.data.status === "ongoing") {
      return (
        <OngoingAttempt
          studentAssessmentAttemptInfo={studentAssessmentAttemptInfo}
          classId={classId}
          items={
            studentAssessmentAttemptInfo.data.assessmentVersion
              .questionnaireSnapshot
          }
          answersFromDb={answersFromDb}
          questionnaireSnapshot={
            studentAssessmentAttemptInfo.data.assessmentVersion
              .questionnaireSnapshot
          }
          attemptId={attemptId}
        />
      );
    } else {
      return (
        <SubmittedAttempt
          classId={classId}
          studentAssessmentAttemptInfo={studentAssessmentAttemptInfo}
          answersFromDb={answersFromDb}
          questionnaireSnapshot={
            studentAssessmentAttemptInfo.data.assessmentVersion
              .questionnaireSnapshot
          }
          submissionSummary={
            studentAssessmentAttemptInfo.data.submissionSummary!
          }
          attemptId={attemptId}
        />
      );
    }
  }
}
