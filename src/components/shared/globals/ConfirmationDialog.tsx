import { Check, X } from "lucide-react";
import { useGlobalStore } from "./utils/useGlobalStore";

type Props = {
  confirmationMessage?: string;
  noLabel?: string;
  yesLabel?: string;
  onClickNo?: () => void;
  onClickYes: () => void;
};

export default function ConfirmationDialog({
  onClickYes,
  confirmationMessage,
  noLabel,
  yesLabel,
  onClickNo,
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
          className="px-5 py-4 font-medium text-lg rounded-lg bg-red-500 text-white flex items-center gap-3"
        >
          <X className="size-6 stroke-2" />
          <p>{noLabel ?? "No"}</p>
        </button>
        <button
          onClick={() => {
            onClickYes();
            toggleOpenDialog(null);
          }}
          className="px-5 py-4 font-medium text-lg rounded-lg bg-mainaccent text-white flex items-center gap-3"
        >
          <Check className="size-6 stroke-2" />
          <p>{yesLabel ?? "Yes"}</p>
        </button>
      </div>
    </div>
  );
}
