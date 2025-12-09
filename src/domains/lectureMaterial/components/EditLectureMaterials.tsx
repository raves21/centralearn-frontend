import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  BookOpen,
  NotebookPen,
  X,
  GripVertical,
  Edit,
  Trash,
  Plus,
  Check,
} from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { ContentType, type ChapterContent } from "../../chapterContents/types";
import AddLectureContentBlockDialog from "./AddLectureMaterialBlockDialog";
import FileLectureMaterialBlock from "./FileLectureMaterialBlock";
import { Link, useNavigate } from "@tanstack/react-router";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { useManageLectureContentStore } from "@/utils/stores/useManageLectureContentStore";
import { useShallow } from "zustand/react/shallow";
import { useGeneralStore } from "@/utils/stores/useGeneralStore";
import { useRef, useState, useEffect } from "react";
import { useAllLectureMaterials } from "../api/queries";

type Props = {
  chapterContentInfo: ChapterContent;
  classId: string;
};

export default function EditLectureMaterials({
  chapterContentInfo,
  classId,
}: Props) {
  const navigate = useNavigate();

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);
  const [blocks, addBlock, addBlockAfter, updateBlock, setBlocks, removeBlock] =
    useManageLectureContentStore(
      useShallow((state) => [
        state.blocks,
        state.addBlock,
        state.addBlockAfter,
        state.updateBlock,
        state.setBlocks,
        state.removeBlock,
      ])
    );

  const { data: lectureMaterials } = useAllLectureMaterials({
    lectureId: chapterContentInfo.contentId,
  });

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

  // Hydrate existing lecture materials into the store
  useEffect(() => {
    if (lectureMaterials) {
      const hydratedBlocks = lectureMaterials.map((material) => {
        if (material.materialType === "App\\Models\\TextAttachment") {
          return {
            id: material.id,
            type: "text" as const,
            content: (material.material as { content: string }).content,
          };
        } else {
          return {
            id: material.id,
            type: "file" as const,
            content: (material.material as { url: string }).url,
          };
        }
      });

      setBlocks(hydratedBlocks);
    }
  }, [lectureMaterials, setBlocks]);

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
            onClick={() => {
              toggleOpenDialog(
                <div className="p-8 flex flex-col justify-center items-center gap-12 bg-white rounded-lg">
                  <p className="text-xl font-semibold">
                    Are you sure you want to save changes?
                  </p>
                  <div className="flex gap-6">
                    <button
                      onClick={() => toggleOpenDialog(null)}
                      className="px-5 py-4 font-medium text-lg rounded-lg bg-red-500 text-white flex items-center gap-3"
                    >
                      <X className="size-6 stroke-2" />
                      <p>No</p>
                    </button>
                    <button className="px-5 py-4 font-medium text-lg rounded-lg bg-mainaccent text-white flex items-center gap-3">
                      <Check className="size-6 stroke-2" />
                      <p>Yes</p>
                    </button>
                  </div>
                </div>
              );
            }}
            className="px-4 py-2 rounded-full bg-green-500 text-white flex items-center gap-3"
          >
            <Check className="size-4" />
            <p>Save changes</p>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-8">
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
                <button
                  onClick={() =>
                    toggleOpenDialog(
                      <AddLectureContentBlockDialog
                        onClickText={() => {
                          addBlockAfter(block.id, { type: "text" });
                          toggleOpenDialog(null);
                        }}
                        onSelectFile={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            addBlockAfter(block.id, { type: "file", file });
                            toggleOpenDialog(null);
                            // Reset the input so the same file can be selected again
                            e.target.value = "";
                          }
                        }}
                        fileInputRef={fileInputRef}
                      />
                    )
                  }
                  className="rounded-full relative group p-3"
                >
                  <span className="absolute inset-0 rounded-full bg-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Plus className="size-5 relative z-10 text-gray-500 group-hover:text-green-500 transition-colors duration-200" />
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
                  <FileLectureMaterialBlock block={block} />
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
    </div>
  );
}
