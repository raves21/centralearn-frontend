import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import ManageLectureDialog from "./ManageLectureDialog";

type Props = {
  chapterId: string;
};

export default function CreateChapterContentDialog({ chapterId }: Props) {
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  return (
    <div className="w-[600px] h-[300px] flex rounded-lg overflow-hidden p-2 bg-gray-bg gap-3">
      <button
        onClick={() => {
          toggleOpenDialog(null);
          setTimeout(() => {
            toggleOpenDialog(
              <ManageLectureDialog type="create" chapterId={chapterId} />
            );
          }, 200);
        }}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Lecture
      </button>
      <button
        onClick={() => toggleOpenDialog(null)}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Assessment
      </button>
    </div>
  );
}
