import {
  useManageAssessmentMaterialsStore,
  type ContentBlock,
} from "../../stores/useManageAssessmentMaterialsStore";
import { useShallow } from "zustand/react/shallow";
import type { EssayItem } from "../../types";
import { useEffect, useState } from "react";
import EditAssessmentMaterialQuestion from "./EditAssessmentMaterialQuestion";
import { Input } from "@/components/ui/input";

type Props = {
  block: ContentBlock & { material: EssayItem };
};

export default function EditEssayItemBlock({ block }: Props) {
  const [blocks, updateBlock] = useManageAssessmentMaterialsStore(
    useShallow((state) => [state.blocks, state.updateBlock]),
  );

  const [itemNumber, setItemNumber] = useState(0);

  useEffect(() => {
    const index = blocks.findIndex((b) => b.id === block.id);
    setItemNumber(index + 1);
  }, [blocks]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-300 p-8 hover:border-mainaccent transition-colors">
      <p className="text-lg font-semibold text-gray-400">Essay</p>
      <div className="flex flex-col rounded-lg border border-gray-200 p-4 gap-5">
        <EditAssessmentMaterialQuestion block={block} itemNumber={itemNumber} />
      </div>
      <div className="grid grid-cols-2 gap-6 w-fit pt-5">
        <div className="flex items-center gap-4">
          <p className="whitespace-nowrap font-medium">Minimum Words:</p>
          <Input
            className="w-20 text-lg ml-auto"
            type="number"
            value={block.material.minWordCount || undefined}
            onChange={(e) => {
              updateBlock(block.id, {
                ...block,
                material: {
                  ...block.material,
                  minWordCount: Number(e.currentTarget.value) || null,
                },
              });
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="whitespace-nowrap font-medium">Maximum Words:</p>
          <Input
            className="w-20 text-lg ml-auto"
            type="number"
            value={block.material.maxWordCount || undefined}
            onChange={(e) => {
              updateBlock(block.id, {
                ...block,
                material: {
                  ...block.material,
                  maxWordCount: Number(e.currentTarget.value) || null,
                },
              });
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="whitespace-nowrap font-medium">Minimum Characters:</p>
          <Input
            className="w-20 text-lg ml-auto"
            type="number"
            value={block.material.minCharacterCount || undefined}
            onChange={(e) => {
              updateBlock(block.id, {
                ...block,
                material: {
                  ...block.material,
                  minCharacterCount: Number(e.currentTarget.value) || null,
                },
              });
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="whitespace-nowrap font-medium">Maximum Characters:</p>
          <Input
            className="w-20 text-lg ml-auto"
            type="number"
            value={block.material.maxCharacterCount || undefined}
            onChange={(e) => {
              updateBlock(block.id, {
                ...block,
                material: {
                  ...block.material,
                  maxCharacterCount: Number(e.currentTarget.value) || null,
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
