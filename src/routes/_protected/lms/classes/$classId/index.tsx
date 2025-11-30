import { useCourseClassChapters } from "@/domains/chapters/api/queries";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Loader, NotebookPen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/custom-accordion";
import { ContentType } from "@/domains/chapterContents/types";

export const Route = createFileRoute("/_protected/lms/classes/$classId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { classId } = Route.useParams();
  const { data: courseClassChapters, status: courseClassChaptersStatus } =
    useCourseClassChapters({ classId });

  if ([courseClassChaptersStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">
        <p className="text-xl font-medium">An error occured.</p>
      </div>
    );
  }

  if ([courseClassChaptersStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (courseClassChapters) {
    return (
      <div className="flex flex-col gap-3 w-full">
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
                {chapter.contents.map((content) => (
                  <Link
                    to="/lms/classes/$classId/contents/$chapterContentId"
                    params={{
                      classId,
                      chapterContentId: content.id
                    }}
                    key={content.id}
                    className="flex items-center w-full gap-4 p-5 bg-white rounded-lg hover:border-mainaccent hover:border-[2px] transition-all"
                  >
                    {content.contentType === ContentType.Lecture && (
                      <BookOpen className="size-5" />
                    )}
                    {content.contentType === ContentType.Assessment && (
                      <NotebookPen className="size-5" />
                    )}
                    <p className="text-[16px] font-medium">{content.name}</p>
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }
}
