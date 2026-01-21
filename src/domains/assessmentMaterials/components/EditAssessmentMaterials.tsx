import {
  ContentType,
  type ChapterContent,
} from "@/domains/chapterContents/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { useProcessBulkAssessmentMaterials } from "../api/mutaions";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookOpen, NotebookPen, X, Check } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useSetTopPanelPointerEventsWhenDragging } from "@/utils/hooks/useSetTopPanelPointerEventsWhenDragging";
import { useAllAssessmentMaterials } from "../api/queries";

type Props = {
  chapterContentInfo: ChapterContent;
  classId: string;
};

export default function EditAssessmentMaterials({
  chapterContentInfo,
  classId,
}: Props) {
  const navigate = useNavigate();

  const {
    mutateAsync: processBulkAssessmentMaterials,
    status: processBulkAssessmentMaterialsStatus,
  } = useProcessBulkAssessmentMaterials();

  usePendingOverlay({
    isPending: processBulkAssessmentMaterialsStatus === "pending",
    pendingLabel: "Saving",
  });

  const { data: assessmentMaterials } = useAllAssessmentMaterials({
    assessmentId: chapterContentInfo.contentId,
  });

  const { setIsDragging } = useSetTopPanelPointerEventsWhenDragging();

  return (
    <div className="flex flex-col gap-12 w-full pb-12">
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
        <div className="flex gap-8">
          <button
            onClick={() =>
              navigate({
                to: "/lms/classes/$classId/contents/$chapterContentId",
                params: {
                  chapterContentId: chapterContentInfo.id,
                  classId,
                },
              })
            }
            className="px-4 py-2 rounded-full bg-red-500 text-white flex items-center gap-3"
          >
            <X className="size-4" />
            <p>Exit edit mode</p>
          </button>
          <button
            onClick={async () => {}}
            className="px-4 py-2 rounded-full bg-green-500 text-white flex items-center gap-3"
          >
            <Check className="size-4" />
            <p>Save changes</p>
          </button>
        </div>
      </div>
      <ReactSortable
        list={blocks}
        setList={updateBlocks}
        handle=".drag-handle"
        animation={150}
        scroll={true}
        scrollSensitivity={100}
        scrollSpeed={10}
        className="flex flex-col gap-12"
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      ></ReactSortable>
    </div>
  );
}
