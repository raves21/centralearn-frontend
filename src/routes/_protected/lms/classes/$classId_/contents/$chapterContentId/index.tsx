import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useChapterContentInfo } from "@/domains/chapterContents/api/queries";
import { ContentType } from "@/domains/chapterContents/types";
import LectureMaterialsList from "@/domains/lectureMaterial/components/LectureMaterialsList";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Edit, Loader, NotebookPen } from "lucide-react";

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId_/contents/$chapterContentId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId, chapterContentId } = Route.useParams();

  const { data: chapterContentInfo, status: chapterContentInfoStatus } =
    useChapterContentInfo(chapterContentId);

  const navigate = useNavigate();

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
                      {chapterContentInfo.chapter.name}
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{chapterContentInfo.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              {chapterContentInfo.contentType === ContentType.Lecture && (
                <BookOpen className="size-8" />
              )}
              {chapterContentInfo.contentType === ContentType.Assessment && (
                <NotebookPen className="size-8" />
              )}
              <p className="text-2xl font-bold">{chapterContentInfo.name}</p>
            </div>
          </div>
          <button
            onClick={() =>
              navigate({
                to: "/lms/classes/$classId/contents/$chapterContentId/edit",
                params: {
                  chapterContentId,
                  classId,
                },
              })
            }
            className="px-4 py-2 rounded-full bg-mainaccent text-white flex items-center gap-3"
          >
            <Edit className="size-4" />
            <p>Enter edit mode</p>
          </button>
        </div>
        {chapterContentInfo.contentType === ContentType.Lecture && (
          <LectureMaterialsList lectureId={chapterContentInfo.contentId} />
        )}
      </div>
    );
  }
}
