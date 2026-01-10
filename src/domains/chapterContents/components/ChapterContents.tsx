import { ReactSortable } from "react-sortablejs";
import { ContentType, type ChapterContent } from "../types";
import {
  BookOpen,
  EllipsisVertical,
  GripVertical,
  NotebookPen,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useDeleteLectureContent,
  useReorderChapterContentBulk,
} from "../api/mutations";
import { toast } from "sonner";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import ManageLectureDialog from "./ManageLectureDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationDialog from "@/components/shared/globals/ConfirmationDialog";
import CreateChapterContentDialog from "./CreateChapterContentDialog";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import { useSetTopPanelPointerEventsWhenDragging } from "@/utils/hooks/useSetTopPanelPointerEventsWhenDragging";
import { useChapterContentReorderStore } from "../stores/useChapterContentReorderStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

type Props = {
  chapterContents: ChapterContent[];
  chapterId: string;
};

export default function ChapterContents({ chapterContents, chapterId }: Props) {
  const navigate = useNavigate();
  const {
    mutateAsync: reorderChapterContentBulk,
    status: reorderChapterContentBulkStatus,
  } = useReorderChapterContentBulk();

  const { setIsDragging } = useSetTopPanelPointerEventsWhenDragging();

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const { classId } = useParams({ from: "/_protected/lms/classes/$classId/" });

  const [chapterContentsGlobalState, setChapterContentsGlobalState] =
    useChapterContentReorderStore(
      useShallow((state) => [
        state.chapterContentsGlobalState,
        state.setChapterContentsGlobalState,
      ])
    );

  useEffect(() => {
    setChapterContentsGlobalState(chapterContents);
  }, [chapterContents]);

  const {
    mutateAsync: deleteLectureContent,
    status: deleteLectureContentStatus,
  } = useDeleteLectureContent();

  usePendingOverlay({
    isPending: deleteLectureContentStatus === "pending",
    pendingLabel: "Deleting lecture",
  });

  usePendingOverlay({
    isPending: reorderChapterContentBulkStatus === "pending",
    pendingLabel: "Reordering chapter contents",
  });

  return (
    <div className="flex flex-col gap-8">
      <ReactSortable
        list={chapterContentsGlobalState}
        setList={setChapterContentsGlobalState}
        handle=".drag-handle"
        animation={150}
        scroll={true}
        scrollSensitivity={100}
        scrollSpeed={10}
        className="flex flex-col gap-5"
        onStart={() => setIsDragging(true)}
        onEnd={async () => {
          setIsDragging(false);
          const currentContents =
            useChapterContentReorderStore.getState().chapterContentsGlobalState;

          const updates = currentContents
            .map((content, index) => ({
              id: content.id,
              new_order: index + 1,
              isChanged: content.order !== index + 1,
            }))
            .filter((content) => content.isChanged)
            .map((content) => ({
              id: content.id,
              new_order: content.new_order,
            }));

          console.log(updates);
          if (updates.length > 0) {
            try {
              await reorderChapterContentBulk(updates);
            } catch (error) {
              toast.error(
                "An error occured while re-ordering chapter contents."
              );
            }
          }
        }}
      >
        {chapterContents.map((content) => (
          <div className="flex items-start gap-3 w-full" key={content.id}>
            <button
              onClick={(e) => e.stopPropagation()}
              className="drag-handle relative cursor-grab rounded-full active:cursor-grabbing group p-3"
            >
              <span className="absolute inset-0 rounded-full bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <GripVertical className="size-5 relative z-10 text-gray-500 group-hover:text-gray-500 transition-colors duration-200" />
            </button>
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate({
                  to: "/lms/classes/$classId/contents/$chapterContentId",
                  params: {
                    classId,
                    chapterContentId: content.id,
                  },
                })
              }
              key={content.id}
              className="flex justify-between w-full p-5 bg-white rounded-lg hover:border-mainaccent hover:border-[2px] transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {content.contentType === ContentType.Lecture && (
                    <BookOpen className="size-5" />
                  )}
                  {content.contentType === ContentType.Assessment && (
                    <NotebookPen className="size-5" />
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-lg font-medium">{content.name}</p>
                  {content.description && (
                    <p className="text-gray-400 text-[16px]">
                      {content.description}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="relative group rounded-full p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="absolute inset-0 rounded-full bg-mainaccent/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <EllipsisVertical className="size-6 relative z-10 text-gray-500 group-hover:text-white transition-colors duration-200" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      if (content.contentType === ContentType.Lecture) {
                        toggleOpenDialog(
                          <ManageLectureDialog
                            chapterId={chapterId}
                            type="edit"
                            chapterContent={content}
                          />
                        );
                      }
                    }}
                  >
                    Edit
                    <Pencil className="stroke-mainaccent" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async (e) => {
                      e.stopPropagation();
                      toggleOpenDialog(
                        <ConfirmationDialog
                          onClickYes={async () => {
                            if (content.contentType === ContentType.Lecture) {
                              await deleteLectureContent(content.id);
                            }
                          }}
                          confirmationMessage="Are you sure you want to delete this lecture?"
                          yesButtonClassName="bg-red-500 hover:bg-red-600"
                          noButtonClassName="border border-gray-400"
                        />
                      );
                    }}
                  >
                    Delete
                    <Trash className="stroke-red-500" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </ReactSortable>
      <button
        onClick={() =>
          toggleOpenDialog(<CreateChapterContentDialog chapterId={chapterId} />)
        }
        className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full py-4"
      >
        <Plus className="size-8 stroke-gray-500" />
        <p className="font-medium text-gray-500 text-lg">Add Content</p>
      </button>
    </div>
  );
}
