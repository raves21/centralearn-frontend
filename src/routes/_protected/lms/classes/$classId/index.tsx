import { useCourseClassChapters } from "@/domains/chapters/api/queries";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  EllipsisVertical,
  GripVertical,
  NotebookPen,
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
import { ContentType } from "@/domains/chapterContents/types";
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
import CreateChapterContentDialog from "@/domains/chapterContents/components/CreateChapterContentDialog";
import ManageChapterDialog from "@/domains/chapters/components/ManageChapterDialog";
import { useDeleteLectureContent } from "@/domains/chapterContents/api/mutations";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import ConfirmationDialog from "@/components/shared/globals/ConfirmationDialog";
import { useDeleteChapter } from "@/domains/chapters/api/mutations";

export const Route = createFileRoute("/_protected/lms/classes/$classId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId } = Route.useParams();
  const { data: courseClassChapters, status: courseClassChaptersStatus } =
    useCourseClassChapters({ classId });
  const navigate = useNavigate();
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const {
    mutateAsync: deleteLectureContent,
    status: deleteLectureContentStatus,
  } = useDeleteLectureContent();

  const { mutateAsync: deleteChapter, status: deleteChapterStatus } =
    useDeleteChapter();

  usePendingOverlay({
    isPending: deleteChapterStatus === "pending",
    pendingLabel: "Deleting chapter",
  });

  usePendingOverlay({
    isPending: deleteLectureContentStatus === "pending",
    pendingLabel: "Deleting lecture content",
  });

  if ([courseClassChaptersStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([courseClassChaptersStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (courseClassChapters) {
    return (
      <div className="flex flex-col gap-12 w-full">
        <Accordion className="flex flex-col" type="single" collapsible>
          <ReactSortable
            list={courseClassChapters}
            setList={() => {}}
            handle=".drag-handle"
            animation={150}
            scroll={true}
            scrollSensitivity={100}
            scrollSpeed={10}
            className="flex flex-col gap-5"
            // onStart={() => setIsDragging(true)}
            // onEnd={() => setIsDragging(false)}
          >
            {courseClassChapters.map((chapter, i) => (
              <AccordionItem
                key={chapter.id}
                className="flex flex-col gap-3"
                value={i.toString()}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex flex-col gap-6">
                    <button className="drag-handle relative cursor-grab rounded-full active:cursor-grabbing group p-3">
                      <span className="absolute inset-0 rounded-full bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      <GripVertical className="size-5 relative z-10 text-gray-500 group-hover:text-gray-500 transition-colors duration-200" />
                    </button>
                  </div>
                  <div className="w-full relative">
                    <AccordionTrigger className="flex items-start bg-white gap-4 rounded-lg shadow-sm p-4 hover:border-mainaccent hover:border-[2px] transition-all">
                      <ChevronDown className="stroke-gray-800 transition-transform" />
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium">{chapter.name}</p>
                        <p className="text-gray-400 text-[16px]">
                          {chapter.description}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <div className="absolute top-4 right-4 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="relative group rounded-full p-3 ml-auto"
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
                                  chapterId={chapter.id}
                                  data={{
                                    name: chapter.name,
                                    description: chapter.description,
                                    order: chapter.order,
                                    published_at: chapter.published_at
                                      ? new Date(chapter.published_at)
                                      : null,
                                  }}
                                />
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
                </div>
                <AccordionContent className="flex flex-col gap-2 w-full relative pl-16 pb-0">
                  <div className="h-full absolute w-[6px] bg-mainaccent top-0 left-2 rounded-full" />
                  <div className="flex flex-col gap-8">
                    <ReactSortable
                      list={chapter.contents}
                      setList={() => {}}
                      handle=".drag-handle"
                      animation={150}
                      scroll={true}
                      scrollSensitivity={100}
                      scrollSpeed={10}
                      className="flex flex-col gap-5"
                      // onStart={() => setIsDragging(true)}
                      // onEnd={() => setIsDragging(false)}
                    >
                      {chapter.contents.map((content) => (
                        <div
                          className="flex items-start gap-3 w-full"
                          key={content.id}
                        >
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
                                {content.contentType ===
                                  ContentType.Lecture && (
                                  <BookOpen className="size-5" />
                                )}
                                {content.contentType ===
                                  ContentType.Assessment && (
                                  <NotebookPen className="size-5" />
                                )}
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <p className="text-lg font-medium">
                                  {content.name}
                                </p>
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
                                  onClick={(e) => e.stopPropagation()}
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
                                          if (
                                            content.contentType ===
                                            ContentType.Lecture
                                          ) {
                                            await deleteLectureContent(
                                              content.id
                                            );
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
                        toggleOpenDialog(
                          <CreateChapterContentDialog chapterId={chapter.id} />
                        )
                      }
                      className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full py-4"
                    >
                      <Plus className="size-8 stroke-gray-500" />
                      <p className="font-medium text-gray-500 text-lg">
                        Add Content
                      </p>
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </ReactSortable>
        </Accordion>
        <button
          onClick={() =>
            toggleOpenDialog(
              <ManageChapterDialog classId={classId} type="create" />
            )
          }
          className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full py-4"
        >
          <Plus className="size-8 stroke-gray-500" />
          <p className="font-medium text-gray-500 text-lg">Add Chapter</p>
        </button>
      </div>
    );
  }
}
