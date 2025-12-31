import { Check, X } from "lucide-react";
import { useGlobalStore } from "./utils/useGlobalStore";
import { cn } from "@/lib/utils";

type Props = {
  confirmationMessage?: string;
  noLabel?: string;
  yesLabel?: string;
  onClickNo?: () => void;
  onClickYes: () => void;
  yesButtonClassName?: string;
  noButtonClassName?: string;
};

export default function ConfirmationDialog({
  onClickYes,
  confirmationMessage,
  noLabel,
  yesLabel,
  onClickNo,
  yesButtonClassName,
  noButtonClassName,
}: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  return (
    <div className="p-8 flex flex-col justify-center items-center gap-12 bg-white rounded-lg">
      <p className="text-xl font-semibold">
        {confirmationMessage ?? "Are you sure you want to proceed?"}
      </p>
      <div className="flex gap-6">
        <button
          onClick={onClickNo ? onClickNo : () => toggleOpenDialog(null)}
          className={cn(
            "px-6 py-3 font-medium text-lg rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2.5",
            noButtonClassName
          )}
        >
          <X className="size-5 stroke-[3]" />
          <p>{noLabel ?? "No"}</p>
        </button>
        <button
          onClick={() => {
            onClickYes();
            toggleOpenDialog(null);
          }}
          className={cn(
            "px-6 py-3 font-medium text-lg rounded-lg bg-mainaccent text-white hover:bg-mainaccent/90 transition-colors flex items-center gap-2.5",
            yesButtonClassName
          )}
        >
          <Check className="size-5 stroke-[3]" />
          <p>{yesLabel ?? "Yes"}</p>
        </button>
      </div>
    </div>
  );
}
