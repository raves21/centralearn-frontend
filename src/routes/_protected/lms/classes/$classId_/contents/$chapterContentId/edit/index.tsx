import { useChapterContentInfo } from "@/domains/chapterContents/api/queries";
import EditLectureMaterials from "@/domains/lectureMaterial/components/EditLectureMaterials";
import { ContentType } from "@/domains/chapterContents/types";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

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
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if ([chapterContentInfoStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
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
