import { useShallow } from "zustand/react/shallow";
import { ReactSortable } from "react-sortablejs";
import {
  type ContentBlock,
  useManageAssessmentMaterialsStore,
} from "../../stores/useManageAssessmentMaterialsStore";
import type { OptionBasedItem, OptionBasedItemOption } from "../../types";
import { useEffect, useRef, useState } from "react";
import EditAssessmentMaterialQuestion from "./EditAssessmentMaterialQuestion";
import { Plus } from "lucide-react";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import AddOptionDialog from "./AddOptionDialog";
import EditOption from "./EditOption";

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

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const checkboxRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-8 rounded-lg border-2 border-gray-300 p-8 hover:border-mainaccent transition-colors">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold text-gray-400">Option Based</p>
        <div className="flex flex-col gap-5">
          <EditAssessmentMaterialQuestion
            block={block}
            itemNumber={itemNumber}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <p className="font-medium text-lg">Options</p>
        <div
          onClick={() => {
            if (checkboxRef.current) {
              updateBlock(block.id, {
                ...block,
                material: {
                  ...block.material,
                  isAlphabeticalOrder: !checkboxRef.current.checked,
                },
              });
            }
          }}
          className="flex items-center gap-2 hover:cursor-pointer select-none w-min"
        >
          <input
            ref={checkboxRef}
            type="checkbox"
            className="size-4 cursor-pointer accent-mainaccent"
            checked={block.material.isAlphabeticalOrder}
          />
          <p className="whitespace-nowrap">Alphabetical Order</p>
        </div>
        <div className="flex flex-col gap-6">
          <ReactSortable
            list={block.material.options}
            setList={(options: OptionBasedItemOption[]) => {
              updateBlock(block.id, {
                ...block,
                material: {
                  ...block.material,
                  options,
                },
              });
            }}
            className="flex flex-col gap-6"
            handle=".drag-handle"
            animation={200}
          >
            {block.material.options.map((option) => (
              <EditOption
                key={option.id}
                block={block}
                optionId={option.id}
                type={option.optionText !== null ? "text" : "image"}
              />
            ))}
          </ReactSortable>
          <button
            onClick={() =>
              toggleOpenDialog(
                <AddOptionDialog
                  onClickText={() => {
                    updateBlock(block.id, {
                      ...block,
                      material: {
                        ...block.material,
                        options: [
                          ...block.material.options,
                          {
                            id: crypto.randomUUID(),
                            isCorrect: false,
                            optionText: "",
                            optionFile: null,
                          },
                        ],
                      },
                    });
                    toggleOpenDialog(null);
                  }}
                  onSelectImageFile={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      updateBlock(block.id, {
                        ...block,
                        material: {
                          ...block.material,
                          options: [
                            ...block.material.options,
                            {
                              id: crypto.randomUUID(),
                              isCorrect: false,
                              optionText: null,
                              optionFile: file,
                            },
                          ],
                        },
                      });
                      toggleOpenDialog(null);
                    }
                  }}
                />,
              )
            }
            className="flex justify-center items-center gap-4 border hover:bg-gray-200 transition-colors rounded-md border-mainaccent w-[600px] py-4"
          >
            <Plus className="size-4 stroke-mainaccent" />
            <p className="font-medium text-mainaccent">Add Option</p>
          </button>
        </div>
      </div>
    </div>
  );
}
