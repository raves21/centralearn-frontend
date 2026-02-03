import { Edit, GripVertical, Plus, Trash } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import {
  useManageLectureContentStore,
  type ContentBlock,
} from "../../stores/useManageLectureContentStore";
import AddLectureMaterialBlockDialog from "./AddLectureMaterialBlockDialog";
import EditFileBlock from "./EditFileBlock";
import EditTextBlock from "./EditTextBlock";

type Props = {
  block: ContentBlock;
};

export default function EditLectureMaterialBlock({ block }: Props) {
  const [removeBlock, addBlockAfter] = useManageLectureContentStore(
    useShallow((state) => [state.removeBlock, state.addBlockAfter]),
  );

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  return (
    <div key={block.id} className="flex gap-3">
      <div className="flex flex-col gap-6">
        <button className="drag-handle relative cursor-grab rounded-full active:cursor-grabbing group p-3">
          <span className="absolute inset-0 rounded-full bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <GripVertical className="size-5 relative z-10 text-gray-500 group-hover:text-gray-500 transition-colors duration-200" />
        </button>
        {block.type === "file" && (
          <button
            // onClick={() => removeBlock(block.id)}
            className="rounded-full relative group p-3"
          >
            <span className="absolute inset-0 rounded-full bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <Edit className="size-5 relative z-10 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
          </button>
        )}
        <button
          onClick={() => removeBlock(block.id)}
          className="rounded-full relative group p-3"
        >
          <span className="absolute inset-0 rounded-full bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <Trash className="size-5 relative z-10 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
        </button>
        <button
          onClick={() =>
            toggleOpenDialog(
              <AddLectureMaterialBlockDialog
                onClickText={() => {
                  addBlockAfter(block.id, { type: "text" });
                  toggleOpenDialog(null);
                }}
                onSelectFile={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    addBlockAfter(block.id, { type: "file", file });
                    toggleOpenDialog(null);
                    // Reset the input so the same file can be selected again
                    e.target.value = "";
                  }
                }}
              />,
            )
          }
          className="rounded-full relative group p-3"
        >
          <span className="absolute inset-0 rounded-full bg-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <Plus className="size-5 relative z-10 text-gray-500 group-hover:text-green-500 transition-colors duration-200" />
        </button>
      </div>
      <div className="flex-1 item-stretch">
        {block.type === "text" && <EditTextBlock block={block} />}
        {block.type === "file" && <EditFileBlock block={block} />}
      </div>
    </div>
  );
}
