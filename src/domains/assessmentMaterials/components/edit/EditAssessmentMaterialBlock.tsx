import { GripVertical, Plus, Trash } from "lucide-react";
import { type ContentBlock } from "../../stores/useManageAssessmentMaterialsStore";
import { useShallow } from "zustand/react/shallow";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import { useManageAssessmentMaterialsStore } from "../../stores/useManageAssessmentMaterialsStore";
import AddAssessmentMaterialBlockDialog from "./AddAssessmentMaterialBlockDialog";
import EditEssayItemBlock from "./EditEssayItemBlock";
import type {
  EssayItem,
  IdentificationItem,
  OptionBasedItem,
} from "../../types";
import EditIdentificationItemBlock from "./EditIdentificationItemBlock";
import EditOptionBasedItemBlock from "./EditOptionBasedItemBlock";

type Props = {
  block: ContentBlock;
};

export default function EditAssessmentMaterialBlock({ block }: Props) {
  const [removeBlock, addBlockAfter] = useManageAssessmentMaterialsStore(
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
              <AddAssessmentMaterialBlockDialog
                onClickEssay={() => {
                  addBlockAfter(block.id, "essayItem");
                  toggleOpenDialog(null);
                }}
                onClickIdentification={() => {
                  addBlockAfter(block.id, "identificationItem");
                  toggleOpenDialog(null);
                }}
                onClickOptionBased={() => {
                  addBlockAfter(block.id, "optionBasedItem");
                  toggleOpenDialog(null);
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
        {block.materialType === "essayItem" && (
          <EditEssayItemBlock
            block={block as ContentBlock & { material: EssayItem }}
          />
        )}
        {block.materialType === "identificationItem" && (
          <EditIdentificationItemBlock
            block={block as ContentBlock & { material: IdentificationItem }}
          />
        )}
        {block.materialType === "optionBasedItem" && (
          <EditOptionBasedItemBlock
            block={block as ContentBlock & { material: OptionBasedItem }}
          />
        )}
      </div>
    </div>
  );
}
