import { formatToLocal } from "@/utils/sharedFunctions";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/custom-accordion";
import dayjs from "dayjs";
import { Loader2, ChevronDown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentUser } from "@/domains/auth/api/queries";
import { useResultAndAttempts } from "@/domains/studentAssessmentAttempts/api/queries";

type Props = {
  classId: string;
  assessmentId: string;
};

export default function ResultAndAttemptsDisplay({
  classId,
  assessmentId,
}: Props) {
  const navigate = useNavigate();

  const { data: currentUser } = useCurrentUser();
  const { data: resultAndAttempts, status: resultAndAttemptsStatus } =
    useResultAndAttempts(currentUser?.studentId, assessmentId);

  if (resultAndAttemptsStatus === "pending") {
    return (
      <div className="w-full pt-8 grid place-items-center">
        <Loader2 className="size-8 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (resultAndAttempts) {
    const asmtResult = resultAndAttempts.assessmentResult;

    return (
      <div className="flex flex-col w-full">
        <hr className="mx-6 border-gray-200" />
        <div className="p-6 flex flex-col gap-4">
          <Accordion
            type="single"
            defaultValue="item-1"
            collapsible
            className="w-full"
          >
            <AccordionItem
              value="item-1"
              className="rounded-md flex flex-col gap-3"
            >
              <AccordionTrigger className="group flex items-start border border-gray-200 justify-between px-3 py-4 bg-white hover:bg-gray-100/50 transition-colors">
                <div className="flex items-start gap-[10px]">
                  <ChevronDown className="stroke-gray-800 size-5 transition-transform pt-[2] group-data-[state=open]:rotate-180" />
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Final Result</p>
                    <p className="text-gray-400">
                      {dayjs(formatToLocal(asmtResult.lastRecordedAt)).format(
                        "MMM D, YYYY h:mm a",
                      )}
                    </p>
                  </div>
                </div>
                {asmtResult.finalScore ? (
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{asmtResult.finalScore}</p>
                    <p className="font-medium">
                      /<span>&nbsp;</span>
                      {asmtResult.maxScore}
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
                  <button
                    key={attempt.id}
                    onClick={() =>
                      navigate({
                        to: "/lms/classes/$classId/contents/attempt/$attemptId",
                        params: {
                          attemptId: attempt.id,
                          classId,
                        },
                      })
                    }
                    className="flex text-start items-stretch rounded-md border border-gray-200 justify-between px-3 py-4 bg-white hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          Attempt {attempt.attemptNumber}
                        </p>
                        {attempt.status === "ongoing" ? (
                          <p className="px-3 py-[6px] text-xs bg-yellow-200 text-yellow-800 rounded-full">
                            Ongoing
                          </p>
                        ) : (
                          <p className="px-3 py-[6px] text-xs bg-green-200 text-green-800 rounded-full">
                            Submitted
                          </p>
                        )}
                      </div>
                      {attempt.submittedAt && (
                        <p className="text-gray-400">
                          {dayjs(formatToLocal(attempt.submittedAt)).format(
                            "MMM D, YYYY h:mm a",
                          )}
                        </p>
                      )}
                    </div>
                    {attempt.totalScore ? (
                      <div className="flex gap-2 items-center pr-1">
                        <p className="font-medium">{attempt.totalScore}</p>
                        <p className="font-medium">
                          /<span>&nbsp;</span>
                          {asmtResult.maxScore}
                        </p>
                      </div>
                    ) : (
                      <p className="bg-yellow-200 text-yellow-800 rounded-full h-fit my-auto py-2 px-3 text-xs">
                        Pending
                      </p>
                    )}
                  </button>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
}
