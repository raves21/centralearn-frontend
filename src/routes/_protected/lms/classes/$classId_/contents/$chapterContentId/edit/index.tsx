import { useChapterContentInfo } from "@/domains/chapterContents/api/queries";
import EditLectureMaterials from "@/domains/lectureMaterial/components/editLectureMaterials/EditLectureMaterials";
import { ContentType, type Assessment } from "@/domains/chapterContents/types";
import { createFileRoute } from "@tanstack/react-router";
import ShowLoadingComponent from "@/components/shared/LoadingComponent";
import ShowErrorComponent from "@/components/shared/ErrorComponent";
import EditAssessmentMaterials from "@/domains/assessmentMaterials/components/adminInstructorView/edit/EditAssessmentMaterials";

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId_/contents/$chapterContentId/edit/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId, chapterContentId } = Route.useParams();

  const { data: chapterContentInfo, status: chapterContentInfoStatus } =
    useChapterContentInfo(chapterContentId);

  if ([chapterContentInfoStatus].includes("error")) {
    return <ShowErrorComponent />;
  }

  if ([chapterContentInfoStatus].includes("pending")) {
    return <ShowLoadingComponent />;
  }

  if (chapterContentInfo) {
    if (chapterContentInfo.contentType === ContentType.Lecture) {
      return (
        <EditLectureMaterials
          chapterContentInfo={chapterContentInfo}
          classId={classId}
        />
      );
    }
    return (
      <EditAssessmentMaterials
        chapterContentInfo={chapterContentInfo}
        classId={classId}
        initialTotalPoints={
          (chapterContentInfo.content as Assessment).maxAchievableScore
        }
      />
    );
  }
}
