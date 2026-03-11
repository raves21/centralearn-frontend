import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import type { UnansweredItem } from "../stores/useAttemptAnswersStore";

type Props = {
  unansweredItems: UnansweredItem[];
  onSubmit: () => void;
};

export default function UnansweredItemsWarningDialog({
  unansweredItems,
  onSubmit,
}: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  return (
    <div className="flex flex-col gap-8 p-6 w-[500px] h-[400px] bg-white rounded-md">
      {/* Header */}
      <p className="text-lg font-medium text-center">Unanswered Questions</p>

      {/* Scrollable section */}
      <div className="flex flex-col gap-3 w-full flex-grow overflow-y-auto">
        {unansweredItems.map((unansweredItem) => (
          <button
            key={unansweredItem.assessmentMaterialId}
            onClick={() => {
              const itemRef = document.getElementById(
                unansweredItem.assessmentMaterialId,
              );

              if (itemRef) {
                toggleOpenDialog(null);
                itemRef.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-4 hover:bg-gray-100"
          >
            <div className="flex items-center font-medium">
              <p>Question {unansweredItem.itemNumber}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center h-[15%] w-full gap-3">
        <button
          onClick={() => toggleOpenDialog(null)}
          className="w-1/2 h-full grid place-items-center bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Close
        </button>

        <button
          onClick={() => onSubmit()}
          className="w-1/2 h-full grid place-items-center bg-mainaccent hover:bg-indigo-800 text-white rounded-md"
        >
          Submit Anyway
        </button>
      </div>
    </div>
  );
}
