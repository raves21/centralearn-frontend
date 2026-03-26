import { NotebookPen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { StudentAssessmentAttemptInfoWithAssessment } from "../types";
import OngoingAttemptTimer from "./OngoingAttemptTimer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  studentAssessmentAttemptInfo: StudentAssessmentAttemptInfoWithAssessment;
  classId: string;
  initialTimeRemaining: number;
  attemptId: string
};

export default function OngoingAttemptHeader({
  studentAssessmentAttemptInfo,
  classId,
  initialTimeRemaining,
  attemptId
}: Props) {
  const chapterContent = studentAssessmentAttemptInfo.assessment.chapterContent;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-8 w-full">
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
                  {chapterContent.chapter.name}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{chapterContent.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-between p-6 rounded-md bg-white w-full">
          <div className="flex items-center gap-4 w-full">
            <NotebookPen className="size-8" />
            {studentAssessmentAttemptInfo.data.status === "ongoing" ? (
              <p className="text-2xl font-bold">{chapterContent.name}</p>
            ) : (
              <div className="flex items-center gap-5">
                <p className="text-2xl font-bold">{chapterContent.name}</p>
                <p className="py-1 px-2 rounded-md bg-orange-200 text-orange-800 border border-orange-800">
                  Read-Only
                </p>
              </div>
            )}
            {studentAssessmentAttemptInfo.data.maxAchievableScore && (
              <div className="px-3 py-2 ml-3 rounded-md border border-mainaccent text-mainaccent font-semibold text-lg">
                {studentAssessmentAttemptInfo.data.maxAchievableScore}{" "}
                {studentAssessmentAttemptInfo.data.maxAchievableScore === 1
                  ? "point"
                  : "points"}
              </div>
            )}
          </div>
          {studentAssessmentAttemptInfo.assessment.timeLimit && (
            <OngoingAttemptTimer
              attemptId={attemptId}
              totalDurationSeconds={
                studentAssessmentAttemptInfo.assessment.timeLimit
              }
              remainingTimeSeconds={initialTimeRemaining}
              classId={classId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
