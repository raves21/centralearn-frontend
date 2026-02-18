import { useCourseClassChapters } from "@/domains/chapters/api/queries";
import { useChapterReorderStore } from "@/domains/chapters/stores/useChapterReorderStore";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  EllipsisVertical,
  GripVertical,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/custom-accordion";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactSortable } from "react-sortablejs";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import ManageChapterDialog from "@/domains/chapters/components/ManageChapterDialog";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import ConfirmationDialog from "@/components/shared/globals/ConfirmationDialog";
import {
  useDeleteChapter,
  useReorderChapterBulk,
} from "@/domains/chapters/api/mutations";
import { useEffect } from "react";
import { toast } from "sonner";
import ChapterContents from "@/domains/chapterContents/components/ChapterContents";
import { useSetTopPanelPointerEventsWhenDragging } from "@/utils/hooks/useSetTopPanelPointerEventsWhenDragging";
import { useShallow } from "zustand/react/shallow";
import RoleBasedComponent from "@/components/shared/RoleBasedComponent";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected/lms/classes/$classId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId } = Route.useParams();
  const { data: courseClassChapters, status: courseClassChaptersStatus } =
    useCourseClassChapters({ classId });
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const [chaptersGlobalState, setChaptersGlobalState] = useChapterReorderStore(
    useShallow((state) => [
      state.chaptersGlobalState,
      state.setChaptersGlobalState,
    ]),
  );

  useEffect(() => {
    if (courseClassChapters) {
      setChaptersGlobalState(courseClassChapters);
    }
  }, [courseClassChapters]);

  const { setIsDragging } = useSetTopPanelPointerEventsWhenDragging();

  const { mutateAsync: deleteChapter, status: deleteChapterStatus } =
    useDeleteChapter();

  const { mutateAsync: reorderChapterBulk, status: reorderChapterBulkStatus } =
    useReorderChapterBulk();

  usePendingOverlay({
    isPending: reorderChapterBulkStatus === "pending",
    pendingLabel: "Reordering chapters",
  });

  usePendingOverlay({
    isPending: deleteChapterStatus === "pending",
    pendingLabel: "Deleting chapter",
  });

  if ([courseClassChaptersStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([courseClassChaptersStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (courseClassChapters && chaptersGlobalState) {
    return (
      <div className="flex flex-col gap-12 w-full text-base pb-16">
        <Accordion className="flex flex-col" type="single" collapsible>
          <ReactSortable
            list={chaptersGlobalState}
            setList={setChaptersGlobalState}
            handle=".drag-handle"
            animation={150}
            scroll={true}
            scrollSensitivity={100}
            scrollSpeed={10}
            className="flex flex-col gap-5"
            onStart={() => setIsDragging(true)}
            onEnd={async () => {
              setIsDragging(false);
              const currentChapters =
                useChapterReorderStore.getState().chaptersGlobalState;
              const updates = currentChapters
                .map((chapter, index) => ({
                  id: chapter.id,
                  new_order: index + 1,
                  isChanged: chapter.order !== index + 1,
                }))
                .filter((chapter) => chapter.isChanged)
                .map((chapter) => ({
                  id: chapter.id,
                  new_order: chapter.new_order,
                }));

              console.log(updates);
              if (updates.length > 0) {
                try {
                  await reorderChapterBulk(updates);
                } catch (error) {
                  toast.error("An error occured while re-ordering chapters.");
                }
              }
            }}
          >
            {courseClassChapters.map((chapter, i) => (
              <AccordionItem
                key={chapter.id}
                className="flex flex-col gap-3"
                value={i.toString()}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex flex-col gap-6">
                    <RoleBasedComponent
                      adminComponent={
                        <button className="drag-handle relative cursor-grab rounded-full active:cursor-grabbing group p-3">
                          <span className="absolute inset-0 rounded-full bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                          <GripVertical className="size-5 relative z-10 text-gray-500 group-hover:text-gray-500 transition-colors duration-200" />
                        </button>
                      }
                    />
                  </div>
                  <div className="w-full relative">
                    <AccordionTrigger
                      className={cn(
                        "flex items-start bg-white gap-4 rounded-lg shadow-sm p-4 hover:border-mainaccent hover:border-[2px] transition-all",
                        { "px-4 py-6": !chapter.description },
                      )}
                    >
                      <ChevronDown className="stroke-gray-800 transition-transform" />
                      <div className="flex flex-col gap-2 text-base">
                        <p className="font-medium">{chapter.name}</p>
                        <p className="text-gray-400">{chapter.description}</p>
                      </div>
                    </AccordionTrigger>
                    <div className="absolute -translate-y-1/2 top-1/2 right-5 z-10">
                      <RoleBasedComponent
                        adminComponent={
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="group rounded-full p-3 ml-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="absolute inset-0 rounded-full bg-mainaccent/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                              <EllipsisVertical className="size-6 relative z-10 text-gray-500 group-hover:text-white transition-colors duration-200" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOpenDialog(
                                    <ManageChapterDialog
                                      classId={classId}
                                      type="edit"
                                      chapter={chapter}
                                    />,
                                  );
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
                                      confirmationMessage="Are you sure you want to delete this chapter?"
                                      onClickYes={async () => {
                                        await deleteChapter(chapter.id);
                                      }}
                                      noButtonClassName="border border-gray-400"
                                      yesButtonClassName="bg-red-500 hover:bg-red-600"
                                    />,
                                  );
                                }}
                              >
                                Delete
                                <Trash className="stroke-red-500" />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        }
                      />
                    </div>
                  </div>
                </div>
                <AccordionContent className="flex flex-col gap-2 w-full relative pl-16 pb-0">
                  {chapter.contents.length > 0 ? (
                    <>
                      <div className="h-full absolute w-[6px] bg-mainaccent top-0 left-2 rounded-full" />
                      <ChapterContents
                        chapterContents={chapter.contents}
                        chapterId={chapter.id}
                      />
                    </>
                  ) : (
                    <p className="mt-8 text-base font-medium text-center">
                      No contents added yet
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </ReactSortable>
        </Accordion>
        <RoleBasedComponent
          adminComponent={
            <button
              onClick={() =>
                toggleOpenDialog(
                  <ManageChapterDialog classId={classId} type="create" />,
                )
              }
              className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full py-4"
            >
              <Plus className="size-8 stroke-gray-500" />
              <p className="font-medium text-gray-500">Add Chapter</p>
            </button>
          }
        />
      </div>
    );
  }
}
