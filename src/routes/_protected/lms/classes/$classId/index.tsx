import { useCourseClassChapters } from "@/domains/chapters/api/queries";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  EllipsisVertical,
  NotebookPen,
  Plus,
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

export const Route = createFileRoute("/_protected/lms/classes/$classId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId } = Route.useParams();
  const { data: courseClassChapters, status: courseClassChaptersStatus } =
    useCourseClassChapters({ classId });

  if ([courseClassChaptersStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([courseClassChaptersStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (courseClassChapters) {
    return (
      <div className="flex flex-col gap-12 w-full">
        <Accordion type="single" collapsible>
          {courseClassChapters.map((chapter, i) => (
            <AccordionItem className="flex flex-col gap-3" value={i.toString()}>
              <AccordionTrigger className="w-full flex items-start gap-4 rounded-lg bg-white shadow-sm p-4 hover:border-mainaccent hover:border-[2px] transition-all">
                <ChevronDown className="stroke-gray-800 transition-transform" />
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-medium">{chapter.name}</p>
                  <p className="text-gray-400 text-[16px]">
                    {chapter.description}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 w-full relative pl-16 pb-0">
                <div className="h-full absolute w-[6px] bg-mainaccent top-0 left-2 rounded-full" />
                <div className="flex flex-col gap-8">
                  {chapter.contents.map((content) => (
                    <Link
                      to="/lms/classes/$classId/contents/$chapterContentId"
                      params={{
                        classId,
                        chapterContentId: content.id,
                      }}
                      key={content.id}
                      className="flex justify-between w-full p-5 bg-white rounded-lg hover:border-mainaccent hover:border-[2px] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        {content.contentType === ContentType.Lecture && (
                          <BookOpen className="size-5" />
                        )}
                        {content.contentType === ContentType.Assessment && (
                          <NotebookPen className="size-5" />
                        )}
                        <p className="text-[16px] font-medium">
                          {content.name}
                        </p>
                      </div>
                      <div className="relative group rounded-full p-3">
                        <span className="absolute inset-0 rounded-full bg-mainaccent/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                        <EllipsisVertical className="size-6 relative z-10 text-gray-500 group-hover:text-white transition-colors duration-200" />
                      </div>
                    </Link>
                  ))}
                  <button className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full py-4">
                    <Plus className="size-8 stroke-gray-500" />
                    <p className="font-medium text-gray-500 text-lg">
                      Add Content
                    </p>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <button className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full py-4">
          <Plus className="size-8 stroke-gray-500" />
          <p className="font-medium text-gray-500 text-lg">Add Chapter</p>
        </button>
      </div>
    );
  }
}
