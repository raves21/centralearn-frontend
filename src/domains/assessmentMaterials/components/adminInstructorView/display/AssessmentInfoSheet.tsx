import type {
  Assessment,
  ChapterContent,
} from "@/domains/chapterContents/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
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
import ResultAndAttemptsDisplay from "./ResultAndAttemptsDisplay";

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

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="sm:max-w-[500px] w-[500px] text-sm"
      >
        <div className="size-full flex flex-col">
          <div className="flex items-center gap-4 border-b border-gray-300 px-6 py-8">
            <div className="p-2 rounded-md bg-gray-300">
              <NotebookPen className="stroke-mainaccent size-5" />
            </div>
            <p className="text-base font-bold">{chapterContent.name}</p>
          </div>
          <div className="flex flex-col flex-grow pb-4 min-h-0 overflow-y-auto">
            <div className="p-6 flex flex-col gap-5">
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
                      <p className="font-medium">Open</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4" />
                      <p className="font-medium">Closed</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <hr className="mx-6 border-gray-200" />
            <div className="p-6 flex flex-col gap-6">
              <p className="text-gray-400 font-semibold tracking-wider">
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
                <ResultAndAttemptsDisplay
                  classId={classId}
                  assessmentId={chapterContent.contentId}
                />
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
                  className="w-full font-semibold grid place-item-center py-3 rounded-md text-white bg-mainaccent transition-colors hover:bg-indigo-900"
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
                  className="w-full font-semibold grid place-item-center py-3 rounded-md text-white bg-mainaccent transition-colors hover:bg-indigo-900"
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
              className="w-full font-semibold grid place-item-center py-3 rounded-md bg-white border border-gray-300 transition-colors hover:bg-gray-200"
            >
              Back to Content
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
