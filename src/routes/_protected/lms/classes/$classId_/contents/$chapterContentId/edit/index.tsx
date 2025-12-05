import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useChapterContentInfo } from "@/domains/chapterContents/api/queries";
import { ContentType } from "@/domains/chapterContents/types";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Loader,
  BookOpen,
  NotebookPen,
  X,
  Plus,
  GripVertical,
  Trash,
  Edit,
} from "lucide-react";
import { useManageLectureContentStore } from "@/utils/stores/useManageLectureContentStore";
import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";
import AddLectureContentBlockDialog from "@/domains/chapterContents/components/AddLectureContentBlockDialog";
import { ReactSortable } from "react-sortablejs";
import FileLectureContentBlock from "@/domains/chapterContents/components/FileLectureContentBlock";
import { useGeneralStore } from "@/utils/stores/useGeneralStore";

export const Route = createFileRoute(
  "/_protected/lms/classes/$classId_/contents/$chapterContentId/edit/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId, chapterContentId } = Route.useParams();

  const { data: chapterContentInfo, status: chapterContentInfoStatus } =
    useChapterContentInfo(chapterContentId);

  const navigate = useNavigate();

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);
  const [blocks, addBlock, updateBlock, setBlocks, removeBlock] =
    useManageLectureContentStore(
      useShallow((state) => [
        state.blocks,
        state.addBlock,
        state.updateBlock,
        state.setBlocks,
        state.removeBlock,
      ])
    );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const setTopPanelPointerEventsNone = useGeneralStore(
    (state) => state.setTopPanelPointerEventsNone
  );

  useEffect(() => {
    if (isDragging) {
      setTopPanelPointerEventsNone(true);
    } else {
      setTopPanelPointerEventsNone(false);
    }
  }, [isDragging]);

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
          <button
            onClick={() =>
              navigate({
                to: "/lms/classes/$classId/contents/$chapterContentId",
                params: {
                  chapterContentId,
                  classId,
                },
              })
            }
            className="px-4 py-2 rounded-full bg-red-500 text-white flex items-center gap-3"
          >
            <X className="size-4" />
            <p>Exit edit mode</p>
          </button>
        </div>
        <ReactSortable
          list={blocks}
          setList={setBlocks}
          handle=".drag-handle"
          animation={150}
          scroll={true}
          scrollSensitivity={100}
          scrollSpeed={10}
          className="flex flex-col gap-4"
          onStart={() => setIsDragging(true)}
          onEnd={() => setIsDragging(false)}
        >
          {blocks.map((block) => (
            <div key={block.id} className="flex items-start gap-3">
              <div className="flex flex-col gap-6">
                <button className="drag-handle relative cursor-grab rounded-full active:cursor-grabbing group p-3">
                  <span className="absolute inset-0 rounded-full bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <GripVertical className="size-5 relative z-10 text-gray-500 group-hover:text-gray-500 transition-colors duration-200" />
                </button>
                {block.type === "file" && (
                  <button
                    // onClick={() => removeBlock(block.id)}
                    className="rounded-full relative group p-3"
                  >
                    <span className="absolute inset-0 rounded-full bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <Edit className="size-5 relative z-10 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                  </button>
                )}
                <button
                  onClick={() => removeBlock(block.id)}
                  className="rounded-full relative group p-3"
                >
                  <span className="absolute inset-0 rounded-full bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Trash className="size-5 relative z-10 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                </button>
              </div>
              <div className="flex-1">
                {block.type === "text" && (
                  <TiptapEditor
                    content={block.content}
                    onChange={(content) => updateBlock(block.id, content)}
                  />
                )}
                {block.type === "file" && (
                  <FileLectureContentBlock block={block} />
                )}
              </div>
            </div>
          ))}
        </ReactSortable>
        <button
          onClick={() =>
            toggleOpenDialog(
              <AddLectureContentBlockDialog
                onClickText={() => {
                  addBlock({ type: "text" });
                  toggleOpenDialog(null);
                }}
                onSelectFile={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    addBlock({ type: "file", file });
                    toggleOpenDialog(null);
                    // Reset the input so the same file can be selected again
                    e.target.value = "";
                  }
                }}
                fileInputRef={fileInputRef}
              />
            )
          }
          className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full h-[100px]"
        >
          <Plus className="size-8 stroke-gray-500" />
          <p className="font-medium text-gray-500 text-lg">Add content</p>
        </button>
      </div>
    );
  }
}
