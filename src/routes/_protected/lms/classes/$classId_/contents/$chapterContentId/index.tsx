import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useChapterContentInfo } from "@/domains/chapterContents/api/queries";
import { ContentType } from "@/domains/chapterContents/types";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Loader, NotebookPen } from "lucide-react";

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId_/contents/$chapterContentId/"
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
    return (
      <div className="flex flex-col gap-8 size-full">
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
    );
  }
}
