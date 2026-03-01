import { useCurrentUser } from "@/domains/auth/api/queries";
import type {
  Assessment,
  ChapterContent,
} from "@/domains/chapterContents/types";
import { useStartAttempt } from "@/domains/studentAssessmentAttempts/api/mutations";
import { useStudentAssessmentAttemptAvailability } from "@/domains/studentAssessmentAttempts/api/queries";
import { Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  chapterContent: ChapterContent & { content: Assessment };
  isAssessmentOpen: boolean;
};

export default function StudentTakeAssessmentButton({
  chapterContent,
  isAssessmentOpen,
}: Props) {
  const { classId } = useParams({ from: "/_protected/lms/classes/$classId/" });
  const navigate = useNavigate();

  const { data: currentUser } = useCurrentUser();

  const { mutateAsync: startAttempt, status: startAttemptStatus } =
    useStartAttempt();

  const {
    data: studentAssessmentAttemptInfo,
    status: studentAssessmentAttemptStatus,
  } = useStudentAssessmentAttemptAvailability({
    assessmentId: chapterContent.contentId,
    studentId: currentUser?.studentId,
  });

  if (!currentUser) return <Navigate to="/login" replace />;

  if (studentAssessmentAttemptStatus === "pending") {
    return (
      <button
        disabled={true}
        className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
      >
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="size-5 animate-spin stroke-[3px]" />
          <p className="text-white">Loading</p>
        </div>
      </button>
    );
  }

  if (studentAssessmentAttemptStatus === "error") {
    return (
      <button
        disabled={true}
        className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
      >
        <div className="flex items-center justify-center gap-3">
          <X className="size-5 stroke-[3px]" />
          <p className="text-white">Something went wrong.</p>
        </div>
      </button>
    );
  }

  if (studentAssessmentAttemptInfo) {
    const { attemptsLeft, canStartNewAttempt, continueAttempt } =
      studentAssessmentAttemptInfo;

    if (attemptsLeft <= 0) {
      if (continueAttempt === null) {
        return (
          <button
            disabled={true}
            onClick={() => {}}
            className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
          >
            No attempts left.
          </button>
        );
      } else {
        return (
          <button
            disabled={!isAssessmentOpen}
            onClick={() =>
              navigate({
                to: "/lms/classes/$classId/contents/attempt/$attemptId",
                params: {
                  attemptId: continueAttempt.attemptId,
                  classId,
                },
              })
            }
            className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
          >
            Continue Attempt {continueAttempt.attemptNumber}
          </button>
        );
      }
    } else {
      if (continueAttempt) {
        return (
          <button
            disabled={!isAssessmentOpen}
            onClick={() => {
              //continue attempt logic here before navigating
              navigate({
                to: "/lms/classes/$classId/contents/attempt/$attemptId",
                params: {
                  attemptId: continueAttempt.attemptId,
                  classId,
                },
              });
            }}
            className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
          >
            Continue Attempt {continueAttempt.attemptNumber}
          </button>
        );
      } else {
        if (canStartNewAttempt) {
          if (startAttemptStatus === "idle") {
            return (
              <button
                disabled={!isAssessmentOpen}
                onClick={async () => {
                  try {
                    //create new attempt
                    const newAttempt = await startAttempt({
                      assessmentId: chapterContent.contentId,
                      studentId: currentUser.studentId!,
                    });

                    //navigate to the attempt
                    navigate({
                      to: "/lms/classes/$classId/contents/attempt/$attemptId",
                      params: {
                        attemptId: newAttempt.id,
                        classId,
                      },
                    });
                  } catch (error) {
                    toast.error("An error occured. Please try again later.");
                  }
                }}
                className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
              >
                Start Attempt
              </button>
            );
          }

          if (startAttemptStatus === "pending") {
            return (
              <button
                disabled={true}
                className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
              >
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="size-5 animate-spin stroke-[3px]" />
                  <p className="text-white">Starting Attempt</p>
                </div>
              </button>
            );
          }

          if (startAttemptStatus === "error") {
            return (
              <button
                disabled={true}
                className="w-full font-semibold text-lg grid place-item-center py-3 rounded-md text-white bg-mainaccent disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-gray-300 transition-colors hover:bg-indigo-900"
              >
                <div className="flex items-center justify-center gap-3">
                  <X className="size-5 stroke-[3px]" />
                  <p className="text-white">Something went wrong.</p>
                </div>
              </button>
            );
          }
        }
      }
    }
  }
}
