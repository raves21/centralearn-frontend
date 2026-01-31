import { useShallow } from "zustand/react/shallow";
import {
  type ContentBlock,
  useManageAssessmentMaterialsStore,
} from "../../stores/useManageAssessmentMaterialsStore";
import type { IdentificationItem } from "../../types";
import { useEffect, useRef, useState } from "react";
import EditAssessmentMaterialQuestion from "./EditAssessmentMaterialQuestion";
import IdentificationAcceptedAnswer from "./IdentificationAcceptedAnswers";
import { Plus } from "lucide-react";

type Props = {
  block: ContentBlock & { material: IdentificationItem };
};

export default function EditIdentificationItemBlock({ block }: Props) {
  const [blocks, updateBlock] = useManageAssessmentMaterialsStore(
    useShallow((state) => [state.blocks, state.updateBlock]),
  );
  const [itemNumber, setItemNumber] = useState(0);

  useEffect(() => {
    const index = blocks.findIndex((b) => b.id === block.id);
    setItemNumber(index + 1);
  }, [blocks]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  return (
    <div className="flex flex-col gap-8 rounded-lg border border-gray-300 p-6">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold text-gray-400">Identification</p>
        <div className="flex flex-col gap-5">
          <EditAssessmentMaterialQuestion
            block={block}
            itemNumber={itemNumber}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-medium text-lg">Accepted Answers</p>
        <div
          onClick={() => {
            if (inputRef.current) {
              setIsCaseSensitive(!inputRef.current.checked);
            }
          }}
          className="flex items-center gap-2 hover:cursor-pointer select-none w-min"
        >
          <input
            ref={inputRef}
            type="checkbox"
            className="size-4 cursor-pointer accent-mainaccent"
            checked={isCaseSensitive}
          />
          <p className="whitespace-nowrap">Case Sensitive</p>
        </div>
        <div className="flex items-center flex-wrap gap-4">
          {block.material.acceptedAnswers.map((answer, index) => (
            <IdentificationAcceptedAnswer
              key={index}
              block={block}
              answer={answer}
              index={index}
            />
          ))}
          <button
            onClick={() =>
              updateBlock(block.id, {
                ...block,
                material: {
                  acceptedAnswers: [...block.material.acceptedAnswers, ""],
                },
              })
            }
            className="flex items-center gap-1 text-mainaccent border border-mainaccent rounded-md p-2 hover:bg-gray-200 transition-colors"
          >
            <p>Add Accepted Answer</p>
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
