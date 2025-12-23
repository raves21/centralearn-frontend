import { useChapterContentInfo } from "@/domains/chapterContents/api/queries";
import EditLectureMaterials from "@/domains/lectureMaterial/components/EditLectureMaterials";
import { ContentType } from "@/domains/chapterContents/types";
import { createFileRoute } from "@tanstack/react-router";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId_/contents/$chapterContentId/edit/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId, chapterContentId } = Route.useParams();

  const { data: chapterContentInfo, status: chapterContentInfoStatus } =
    useChapterContentInfo(chapterContentId);

  if ([chapterContentInfoStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([chapterContentInfoStatus].includes("pending")) {
    return <LoadingComponent />;
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
    //todo: return assessment edit component
    return null;
  }
}
