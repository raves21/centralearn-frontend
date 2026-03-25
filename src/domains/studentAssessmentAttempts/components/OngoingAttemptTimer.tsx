import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { formatSecondsToTimer } from "@/utils/sharedFunctions";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  totalDurationSeconds: number;
  remainingTimeSeconds: number;
  classId: string;
};

export default function OngoingAttemptTimer({
  totalDurationSeconds,
  remainingTimeSeconds,
  classId,
}: Props) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.floor(remainingTimeSeconds),
  );

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const navigate = useNavigate();

  useEffect(() => {
    if (remainingSeconds <= 0) {
      navigate({ to: "/lms/classes/$classId", params: { classId } });
      toggleOpenDialog(
        <div className="p-8 flex flex-col justify-center items-center gap-12 bg-white rounded-lg">
          <p className="text-xl font-semibold">This Assessment is closed.</p>
          <button
            onClick={() => toggleOpenDialog(null)}
            className="px-6 py-3 font-medium text-lg text-white rounded-lg bg-mainaccent hover:bg-indigo-800 transition-colors flex items-center gap-2.5"
          >
            <p>OK</p>
          </button>
        </div>,
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
