import { NotebookPen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import OngoingAttemptTimer from "./OngoingAttemptTimer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { StudentAssessmentAttempt } from "../types";

type Props = {
  assessmentName: string;
  chapterName: string;
  studentAssessmentAttemptInfo: StudentAssessmentAttempt;
  classId: string;
  initialTimeRemaining: number | null;
  attemptId: string;
};

export default function OngoingAttemptHeader({
  assessmentName,
  studentAssessmentAttemptInfo,
  chapterName,
  classId,
  initialTimeRemaining,
  attemptId,
}: Props) {
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
                  {chapterName}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{assessmentName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-between p-6 rounded-md bg-white w-full">
          <div className="flex items-center gap-4 w-full">
            <NotebookPen className="size-8" />
            <p className="text-2xl font-bold">{assessmentName}</p>
            {studentAssessmentAttemptInfo.assessmentResult.assessment
              .maxAchievableScore && (
              <div className="px-3 py-2 ml-3 rounded-md border border-mainaccent text-mainaccent font-semibold text-lg">
                {
                  studentAssessmentAttemptInfo.assessmentResult.assessment
                    .maxAchievableScore
                }{" "}
                {studentAssessmentAttemptInfo.assessmentResult.assessment
                  .maxAchievableScore === 1
                  ? "point"
                  : "points"}
              </div>
            )}
          </div>
          {studentAssessmentAttemptInfo.assessmentResult.assessment
            .submissionSettings.timeLimitSeconds &&
            initialTimeRemaining && (
              <OngoingAttemptTimer
                attemptId={attemptId}
                totalDurationSeconds={
                  studentAssessmentAttemptInfo.assessmentResult.assessment
                    .submissionSettings.timeLimitSeconds
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
