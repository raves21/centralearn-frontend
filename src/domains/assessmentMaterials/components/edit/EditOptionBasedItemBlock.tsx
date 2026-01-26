import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import { useShallow } from "zustand/react/shallow";
import {
  type ContentBlock,
  useManageAssessmentMaterialsStore,
} from "../../stores/useManageAssessmentMaterialsStore";
import type { OptionBasedItem } from "../../types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  block: ContentBlock & { material: OptionBasedItem };
};

export default function EditOptionBasedItemBlock({ block }: Props) {
  const [blocks, updateBlock] = useManageAssessmentMaterialsStore(
    useShallow((state) => [state.blocks, state.updateBlock]),
  );
  const [itemNumber, setItemNumber] = useState(0);

  useEffect(() => {
    const index = blocks.findIndex((b) => b.id === block.id);
    setItemNumber(index + 1);
  }, [blocks]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-gray-400">Option-Based</p>
      <div className="flex flex-col rounded-lg border border-gray-200 p-4 gap-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Question {itemNumber}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <p className="font-semibold text-lg">Point worth:</p>
              <Input
                className="w-20 text-lg"
                type="number"
                value={block.pointWorth || 1}
                onChange={(e) => {
                  const val = Number(e.currentTarget.value);
                  updateBlock(block.id, {
                    ...block,
                    pointWorth: val || 1,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <TiptapEditor
          placeholder="Start typing question here..."
          content={block.materialQuestion.questionText}
          onChange={(content) => {
            updateBlock(block.id, {
              ...block,
              materialQuestion: {
                ...block.materialQuestion,
                questionText: content,
              },
            });
          }}
        />
      </div>
    </div>
  );
}
