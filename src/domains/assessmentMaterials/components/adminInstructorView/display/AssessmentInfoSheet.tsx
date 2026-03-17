import type {
  Assessment,
  ChapterContent,
} from "@/domains/chapterContents/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/custom-accordion";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Loader2,
  NotebookPen,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import {
  formatDateStringToDateObj,
  formatToLocal,
} from "@/utils/sharedFunctions";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import RoleBasedComponent from "@/components/shared/RoleBasedComponent";
import StudentTakeAssessmentButton from "../../studentView/StudentTakeAssessmentButton";
import { useCurrentUser } from "@/domains/auth/api/queries";
import { useResultAndAttempts } from "@/domains/studentAssessmentAttempts/api/queries";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  closeDrawer: () => void;
  chapterContent: ChapterContent & { content: Assessment };
};

export default function AssessmentInfoSheet({
  chapterContent,
  isOpen,
  closeDrawer,
  onOpenChange,
}: Props) {
  const navigate = useNavigate();
  const { classId } = useParams({ from: "/_protected/lms/classes/$classId/" });
  const isAssessmentOpen = useMemo(() => {
    const opensAt = chapterContent.opensAt;

    if (!opensAt) return false;

    const opensAtLocalTime = formatToLocal(formatDateStringToDateObj(opensAt));

    const isNowOrBefore =
      dayjs(opensAtLocalTime).isSame(dayjs()) ||
      dayjs(opensAtLocalTime).isBefore(dayjs());

    return isNowOrBefore;
  }, [chapterContent]);

  const { data: currentUser } = useCurrentUser();
  const { data: resultAndAttempts, status: resultAndAttemptsStatus } =
    useResultAndAttempts(currentUser?.studentId, chapterContent.contentId);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="sm:max-w-[500px] w-[500px] text-base"
      >
        <div className="size-full flex flex-col">
          <div className="flex items-center gap-4 border-b border-gray-300 px-6 py-8">
            <div className="p-2 rounded-md bg-gray-300">
              <NotebookPen className="stroke-mainaccent size-7" />
            </div>
            <p className="text-xl font-bold">{chapterContent.name}</p>
          </div>
          <div className="flex flex-col flex-grow pb-4 min-h-0 overflow-y-auto">
            <div className="p-6 flex flex-col gap-5 text-sm">
              <p className="text-gray-400 font-semibold">AVAILABILITY</p>
              <div className="flex items-center w-full justify-between px-2 py-3 rounded-md bg-gray-100">
                <div className="flex items-center gap-3 text-gray-500">
                  <Calendar className="size-5" />
                  <p className="font-medium">Status</p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full",
                    isAssessmentOpen
                      ? "text-green-500 bg-green-100"
                      : "text-red-500 bg-red-100",
                  )}
                >
                  {isAssessmentOpen ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      <p className="font-medium text-sm">Open</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4" />
                      <p className="font-medium text-sm">Closed</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <hr className="mx-6 border-gray-200" />
            <div className="p-6 flex flex-col gap-6">
              <p className="text-gray-400 font-semibold tracking-wider text-sm">
                ASSESSMENT DETAILS
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between whitespace-nowrap gap-4">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Trophy className="size-5" />
                    <p className="font-medium">Max Score</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {chapterContent.content.maxAchievableScore || 0} pts
                  </p>
                </div>

                <div className="flex items-center justify-between whitespace-nowrap gap-4">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Clock className="size-5" />
                    <p className="font-medium">Time Limit</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {chapterContent.content.timeLimit
                      ? `${chapterContent.content.timeLimit} minutes`
                      : "No time limit"}
                  </p>
                </div>

                <RoleBasedComponent
                  adminComponent={
                    <>
                      <div className="flex items-center justify-between whitespace-nowrap gap-4">
                        <div className="flex items-center gap-3 text-gray-500">
                          <Eye className="size-5" />
                          <p className="font-medium">Score Visibility</p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {chapterContent.content.isScoreViewableAfterSubmit
                            ? "Visible after submit"
                            : "Hidden"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between whitespace-nowrap gap-4">
                        <div className="flex items-center gap-3 text-gray-500">
                          <Eye className="size-5" />
                          <p className="font-medium">Answer Visibility</p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {chapterContent.content.isAnswersViewableAfterSubmit
                            ? "Visible after submit"
                            : "Hidden"}
                        </p>
                      </div>
                    </>
                  }
                  instructorComponent={
                    <>
                      <div className="flex items-center justify-between whitespace-nowrap gap-4">
                        <div className="flex items-center gap-3 text-gray-500">
                          <Eye className="size-5" />
                          <p className="font-medium">Score Visibility</p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {chapterContent.content.isScoreViewableAfterSubmit
                            ? "Visible after submit"
                            : "Hidden"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between whitespace-nowrap gap-4">
                        <div className="flex items-center gap-3 text-gray-500">
                          <Eye className="size-5" />
                          <p className="font-medium">Answer Visibility</p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {chapterContent.content.isAnswersViewableAfterSubmit
                            ? "Visible after submit"
                            : "Hidden"}
                        </p>
                      </div>
                    </>
                  }
                />

                <div className="flex items-center justify-between whitespace-nowrap gap-4">
                  <div className="flex items-center gap-3 text-gray-500">
                    <RotateCcw className="size-5" />
                    <p className="font-medium">Max Attempts</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {chapterContent.content.maxAttempts}
                  </p>
                </div>
              </div>
            </div>
            <RoleBasedComponent
              studentComponent={
                <>
                  {resultAndAttemptsStatus === "pending" && (
                    <div className="w-full pt-8 grid place-items-center">
                      <Loader2 className="size-8 stroke-mainaccent animate-spin" />
                    </div>
                  )}
                  {resultAndAttempts && (
                    <>
                      <hr className="mx-6 border-gray-200" />
                      <div className="p-6 flex flex-col gap-4">
                        <p className="text-gray-400 font-semibold tracking-wider text-sm">
                          ASSESSMENT RESULT
                        </p>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem
                            value="result"
                            className="rounded-md flex flex-col gap-3"
                          >
                            <AccordionTrigger className="group flex items-start border border-gray-200 justify-between px-3 py-4 bg-white hover:bg-gray-100/50 transition-colors">
                              <div className="flex items-start gap-[10px]">
                                <ChevronDown className="stroke-gray-800 size-5 transition-transform pt-[2] group-data-[state=open]:rotate-180" />
                                <div className="flex flex-col gap-2">
                                  <p className="font-medium">Final Result</p>
                                  <p className="text-gray-400">
                                    {dayjs(
                                      formatToLocal(
                                        resultAndAttempts.lastRecordedAt,
                                      ),
                                    ).format("MMM D, YYYY h:mm a")}
                                  </p>
                                </div>
                              </div>
                              {resultAndAttempts.finalScore ? (
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">
                                    {resultAndAttempts.finalScore}
                                  </p>
                                  <p className="font-medium">
                                    /<span>&nbsp;</span>
                                    {resultAndAttempts.maxScore}
                                  </p>
                                </div>
                              ) : (
                                <p className="font-medium bg-yellow-200 text-yellow-800 my-auto rounded-full py-2 px-3 text-xs">
                                  Pending
                                </p>
                              )}
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-3 w-full pl-7 relative">
                              <div className="h-full absolute w-[4px] bg-mainaccent top-0 left-0 rounded-full" />
                              {resultAndAttempts.attempts.map((attempt) => (
                                <button className="flex text-start items-stretch rounded-md border border-gray-200 justify-between px-3 py-4 bg-white hover:bg-gray-100/50 transition-colors">
                                  <div className="flex flex-col gap-2">
                                    <p className="font-medium">
                                      Attempt {attempt.attemptNumber}
                                    </p>
                                    <p className="text-gray-400">
                                      {dayjs(
                                        formatToLocal(attempt.submittedAt),
                                      ).format("MMM D, YYYY h:mm a")}
                                    </p>
                                  </div>
                                  {attempt.totalScore ? (
                                    <div className="flex gap-2 items-center pr-1">
                                      <p className="font-medium text-[15px]">
                                        {attempt.totalScore}
                                      </p>
                                      <p className="font-medium text-[15px]">
                                        /<span>&nbsp;</span>
                                        {resultAndAttempts.maxScore}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="font-medium bg-yellow-200 text-yellow-800 rounded-full h-fit my-auto py-2 px-3 text-xs">
                                      Pending
                                    </p>
                                  )}
                                </button>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </>
                  )}
                </>
              }
            />
          </div>
          <div className="mt-auto flex flex-col gap-3 px-6 py-6">
            <RoleBasedComponent
              adminComponent={
                <button
                  onClick={() =>
                    navigate({
                      to: "/lms/classes/$classId/contents/$chapterContentId",
                      params: {
                        chapterContentId: chapterContent.id,
                        classId,
                      },
                    })
                  }
                  className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent transition-colors hover:bg-indigo-900"
                >
                  View
                </button>
              }
              instructorComponent={
                <button
                  onClick={() =>
                    navigate({
                      to: "/lms/classes/$classId/contents/$chapterContentId",
                      params: {
                        chapterContentId: chapterContent.id,
                        classId,
                      },
                    })
                  }
                  className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent transition-colors hover:bg-indigo-900"
                >
                  View
                </button>
              }
              studentComponent={
                <StudentTakeAssessmentButton
                  chapterContent={chapterContent}
                  isAssessmentOpen={isAssessmentOpen}
                />
              }
            />
            <button
              onClick={closeDrawer}
              className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md bg-white border border-gray-300 transition-colors hover:bg-gray-200"
            >
              Back to Content
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
