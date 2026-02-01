import { GripVertical, Trash } from "lucide-react";
import {
  useManageAssessmentMaterialsStore,
  type ContentBlock,
} from "../../stores/useManageAssessmentMaterialsStore";
import type { OptionBasedItem } from "../../types";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";

type Props = {
  block: ContentBlock & { material: OptionBasedItem };
  type: "text" | "image";
  optionId: string;
};

export default function EditOption({ block, optionId, type }: Props) {
  const updateBlock = useManageAssessmentMaterialsStore(
    (state) => state.updateBlock,
  );

  function removeOption() {
    updateBlock(block.id, {
      ...block,
      material: {
        ...block.material,
        options: block.material.options.filter(
          (option) => option.id !== optionId,
        ),
      },
    });
  }

  return (
    <div className="flex gap-3 rounded-md border border-gray-300 px-5 py-8 w-fit">
      <div className="flex flex-col gap-6">
        <button className="drag-handle relative cursor-grab rounded-full active:cursor-grabbing group p-3">
          <span className="absolute inset-0 rounded-full bg-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <GripVertical className="size-5 relative z-10 text-gray-500 group-hover:text-gray-500 transition-colors duration-200" />
        </button>
        <button
          onClick={() => removeOption()}
          className="rounded-full relative group p-3"
        >
          <span className="absolute inset-0 rounded-full bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <Trash className="size-5 relative z-10 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
        </button>
      </div>
      {type === "text" ? (
        <TiptapEditor
          content={
            block.material.options.find((option) => option.id === optionId)
              ?.optionText!
          }
          placeholder="Start typing option text here..."
          className="max-w-[1000px]"
          onChange={(value) => {
            updateBlock(block.id, {
              ...block,
              material: {
                ...block.material,
                options: block.material.options.map((option) => {
                  if (option.id === optionId) {
                    return {
                      ...option,
                      optionText: value,
                    };
                  }
                  return option;
                }),
              },
            });
          }}
        />
      ) : (
        <div>file</div>
      )}
    </div>
  );
}
