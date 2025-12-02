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
import { Loader, BookOpen, NotebookPen, X, Plus } from "lucide-react";
import { useManageLectureContentStore } from "@/utils/stores/useManageLectureContentStore";
import TiptapEditor from "@/components/shared/LMS/tiptap/TiptapEditor";
import { useShallow } from "zustand/react/shallow";
import { useRef } from "react";

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
  const [blocks, addBlock, updateBlock] = useManageLectureContentStore(
    useShallow((state) => [state.blocks, state.addBlock, state.updateBlock])
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="flex flex-col gap-4">
          {blocks.map((block) => (
            <div key={block.id}>
              {block.type === "text" && (
                <TiptapEditor
                  content={block.content}
                  onChange={(content) => updateBlock(block.id, content)}
                />
              )}
              {block.type === "file" &&
                (() => {
                  const fileType = block.content.type;
                  const fileName = block.content.name.toLowerCase();

                  // Check if it's an image
                  if (
                    fileType.startsWith("image/") ||
                    fileName.match(/\.(jpg|jpeg|png)$/)
                  ) {
                    const imageUrl = URL.createObjectURL(block.content);
                    return (
                      <div className="aspect-[16/9] w-[800px] border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={imageUrl}
                          alt={block.content.name}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    );
                  }

                  // Check if it's a video
                  if (
                    fileType.startsWith("video/") ||
                    fileName.match(/\.(mp4|mkv)$/)
                  ) {
                    const videoUrl = URL.createObjectURL(block.content);
                    return (
                      <div className="aspect-[16/9] w-[800px] border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <video src={videoUrl} controls className="size-full">
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  }

                  // Default: show filename for other file types
                  return (
                    <div className="w-full h-[100px] border-2 border-gray-300 rounded-lg grid place-items-center bg-gray-50">
                      <p className="text-lg font-medium text-gray-700">
                        {block.content.name}
                      </p>
                    </div>
                  );
                })()}
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            toggleOpenDialog(
              <div className="w-[600px] h-[300px] flex rounded-lg overflow-hidden p-2 bg-gray-bg gap-3">
                <button
                  onClick={() => {
                    addBlock({ type: "text" });
                    toggleOpenDialog(null);
                  }}
                  className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
                >
                  Text
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      addBlock({ type: "file", file });
                      toggleOpenDialog(null);
                      // Reset the input so the same file can be selected again
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
                >
                  File
                </button>
              </div>
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
