import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookOpen, NotebookPen, X, Plus, Check } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import {
  ContentType,
  type ChapterContent,
} from "../../../chapterContents/types";
import { Link, useNavigate } from "@tanstack/react-router";
import AddLectureMaterialBlockDialog from "./AddLectureMaterialBlockDialog";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { useManageLectureContentStore } from "@/domains/lectureMaterial/stores/useManageLectureContentStore";
import { useShallow } from "zustand/react/shallow";
import { useRef, useEffect } from "react";
import { useAllLectureMaterials } from "../../api/queries";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { useProcessBulkLectureMaterials } from "../../api/mutations";
import ConfirmationDialog from "@/components/shared/globals/ConfirmationDialog";
import type { BulkChangesPayload } from "../../types";
import { toast } from "sonner";
import { isEqual } from "lodash";
import { useSetTopPanelPointerEventsWhenDragging } from "@/utils/hooks/useSetTopPanelPointerEventsWhenDragging";
import EditLectureMaterialBlock from "./EditLectureMaterialBlock";

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
  const [blocks, addBlock, setBlocks, updateBlocks, computeChanges] =
    useManageLectureContentStore(
      useShallow((state) => [
        state.blocks,
        state.addBlock,
        state.setBlocks,
        state.updateBlocks,
        state.computeChanges,
      ]),
    );

  const {
    mutateAsync: processBulkLectureMaterials,
    status: processBulkLectureMaterialsStatus,
  } = useProcessBulkLectureMaterials();

  const { data: lectureMaterials } = useAllLectureMaterials({
    lectureId: chapterContentInfo.contentId,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { setIsDragging } = useSetTopPanelPointerEventsWhenDragging();

  usePendingOverlay({
    isPending: processBulkLectureMaterialsStatus === "pending",
    pendingLabel: "Saving",
  });

  // Hydrate existing lecture materials into the store
  useEffect(() => {
    if (lectureMaterials) {
      const hydratedBlocks = lectureMaterials.map((material) => {
        if (material.materialType === "App\\Models\\TextAttachment") {
          return {
            id: crypto.randomUUID(), // Client-side UUID
            dbId: material.id, // Database ID
            type: "text" as const,
            content: (material.material as { content: string }).content,
          };
        } else {
          return {
            id: crypto.randomUUID(), // Client-side UUID
            dbId: material.id, // Database ID
            type: "file" as const,
            content: (material.material as { url: string }).url,
          };
        }
      });

      setBlocks(hydratedBlocks);
    }
  }, [lectureMaterials, setBlocks]);

  async function onSaveChanges(changes: BulkChangesPayload) {
    try {
      const formData = new FormData();

      formData.append("lecture_id", changes.lecture_id);

      changes.materials.forEach((material, index) => {
        if (material.id) {
          formData.append(`materials[${index}][id]`, material.id);
        }
        formData.append(
          `materials[${index}][material_type]`,
          material.material_type,
        );
        formData.append(
          `materials[${index}][order]`,
          material.order.toString(),
        );

        if (
          material.material_type === "text" &&
          typeof material.material_content === "string"
        ) {
          formData.append(
            `materials[${index}][material_content]`,
            material.material_content,
          );
        } else if (
          material.material_type === "file" &&
          material.material_file
        ) {
          formData.append(
            `materials[${index}][material_file]`,
            material.material_file,
          );
        }
      });
      await processBulkLectureMaterials(formData);

      // Navigate back to view mode
      navigate({
        to: "/lms/classes/$classId/contents/$chapterContentId",
        params: {
          chapterContentId: chapterContentInfo.id,
          classId,
        },
      });
    } catch (error) {
      toast.error("Failed to save changes. Please try again later.");
    }
  }

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
            className="px-4 py-2 rounded-md border border-mainaccent hover:bg-mainaccent/10 transition-colors text-mainaccent flex items-center gap-3"
          >
            <X className="size-4" />
            <p>Exit edit mode</p>
          </button>
          <button
            onClick={async () => {
              const noChanges = isEqual(
                useManageLectureContentStore.getState().blocks,
                useManageLectureContentStore.getState().originalBlocks,
              );
              if (noChanges) {
                navigate({
                  to: "/lms/classes/$classId/contents/$chapterContentId",
                  params: {
                    chapterContentId: chapterContentInfo.id,
                    classId,
                  },
                });
                return;
              }

              // Compute changes
              const changes = computeChanges(chapterContentInfo.contentId);

              toggleOpenDialog(
                <ConfirmationDialog
                  onClickYes={() => onSaveChanges(changes)}
                  confirmationMessage="Are you sure you want to save changes?"
                />,
              );
            }}
            className="px-4 py-2 rounded-md bg-mainaccent hover:bg-indigo-800 transition-colors text-white flex items-center gap-3"
          >
            <Check className="size-4" />
            <p>Save changes</p>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-8">
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
        >
          {blocks.map((block) => (
            <EditLectureMaterialBlock
              key={block.id}
              block={block}
              fileBlockInputRef={fileInputRef}
            />
          ))}
        </ReactSortable>
        <button
          onClick={() =>
            toggleOpenDialog(
              <AddLectureMaterialBlockDialog
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
              />,
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
