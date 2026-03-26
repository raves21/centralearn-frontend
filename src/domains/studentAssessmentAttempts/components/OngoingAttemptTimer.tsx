import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { formatSecondsToTimer } from "@/utils/sharedFunctions";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSubmitAttempt } from "../api/mutations";
import { buildSubmitAttemptPayload } from "../sharedFunctions";
import { BadgeCheck } from "lucide-react";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";

type Props = {
  totalDurationSeconds: number;
  remainingTimeSeconds: number;
  classId: string;
  attemptId: string
};

export default function OngoingAttemptTimer({
  totalDurationSeconds,
  remainingTimeSeconds,
  classId,
  attemptId,
}: Props) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.floor(remainingTimeSeconds),
  );

  const answers = useAttemptAnswersStore((state) => state.answers)

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const navigate = useNavigate();

  const {mutate: submitAttempt} = useSubmitAttempt()

  useEffect(() => {
    if (remainingSeconds <= 0) {
      submitAttempt(buildSubmitAttemptPayload(attemptId, answers))
      navigate({ to: "/lms/classes/$classId", params: { classId } });
      toggleOpenDialog(
        <div className="h-[500px] w-[400px] flex flex-col p-6 bg-white rounded-md">
          <div className="flex flex-col justify-center items-center gap-10 flex-grow text-center">
            <BadgeCheck className="stroke-green-500/40 size-[180px]" />
            <p className="text-2xl font-medium">
              Time's up! Your attempt has been auto-submitted.
            </p>
          </div>
          <button
            onClick={() => toggleOpenDialog(null)}
            className="w-full bg-mainaccent text-white rounded-md hover:bg-indigo-800 py-4 grid place-items-center"
          >
            OK
          </button>
        </div>
      );
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const half = totalDurationSeconds / 2;
  const danger = totalDurationSeconds * 0.2;

  const colorClass = cn(
    "px-3 py-1 rounded-md text-2xl font-semibold",
    remainingSeconds <= danger && "bg-red-200 text-red-900",
    remainingSeconds > danger &&
      remainingSeconds <= half &&
      "bg-orange-200 text-orange-900",
    remainingSeconds > half && "bg-green-200 text-green-900",
  );

  return (
    <div className="flex items-center gap-5">
      <p className="whitespace-nowrap text-base font-medium">Time Remaining:</p>
      <p className={colorClass}>{formatSecondsToTimer(remainingSeconds)}</p>
    </div>
  );
}
