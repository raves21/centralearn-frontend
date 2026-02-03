import { GripVertical, Plus, Trash } from "lucide-react";
import {
  useManageAssessmentMaterialsStore,
  type ContentBlock,
  type OptionBasedItemOptionBlock,
} from "../../stores/useManageAssessmentMaterialsStore";
import type { OptionBasedItem } from "../../types";
import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import AddOptionDialog from "./AddOptionDialog";

type Props = {
  block: ContentBlock & { material: OptionBasedItem };
  type: "text" | "image";
  optionId: string;
};

export default function EditOption({ block, optionId, type }: Props) {
  const updateBlock = useManageAssessmentMaterialsStore(
    (state) => state.updateBlock,
  );

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

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

  const options = block.material.options;
  const optionIndex = options.findIndex((option) => optionId === option.id);
  const optionText = options.find(
    (option) => option.id === optionId,
  )?.optionText;
  const optionFileImage = options.find(
    (option) => option.id === optionId,
  )?.optionFile;

  function addOptionTextAfter() {
    if (optionIndex === -1) {
      updateBlock(block.id, {
        ...block,
        material: {
          ...block.material,
          options: [
            ...block.material.options,
            {
              isCorrect: false,
              optionFile: null,
              optionText: "",
              id: crypto.randomUUID(),
            },
          ],
        },
      });
    }

    const newOptions: OptionBasedItemOptionBlock[] = [
      ...block.material.options,
    ];
    newOptions.splice(optionIndex + 1, 0, {
      id: crypto.randomUUID(),
      isCorrect: false,
      optionFile: null,
      optionText: "",
    });

    updateBlock(block.id, {
      ...block,
      material: {
        ...block.material,
        options: newOptions,
      },
    });
    toggleOpenDialog(null);
  }

  function addOptionFileAfter(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]!;
    if (optionIndex === -1) {
      updateBlock(block.id, {
        ...block,
        material: {
          ...block.material,
          options: [
            ...block.material.options,
            {
              isCorrect: false,
              optionFile: file,
              optionText: null,
              id: crypto.randomUUID(),
            },
          ],
        },
      });
    }

    const newOptions: OptionBasedItemOptionBlock[] = [
      ...block.material.options,
    ];
    newOptions.splice(optionIndex + 1, 0, {
      id: crypto.randomUUID(),
      isCorrect: false,
      optionFile: file,
      optionText: null,
    });

    updateBlock(block.id, {
      ...block,
      material: {
        ...block.material,
        options: newOptions,
      },
    });
    toggleOpenDialog(null);
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
        <button
          onClick={() =>
            toggleOpenDialog(
              <AddOptionDialog
                onClickText={() => addOptionTextAfter()}
                onSelectImageFile={(e) => addOptionFileAfter(e)}
              />,
            )
          }
          className="rounded-full relative group p-3"
        >
          <span className="absolute inset-0 rounded-full bg-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <Plus className="size-5 relative z-10 text-gray-500 group-hover:text-green-500 transition-colors duration-200" />
        </button>
      </div>
      {type === "text" && optionText !== null && optionText !== undefined && (
        <TiptapEditor
          excludeSelectors={[
            "blockquote",
            "orderedList",
            "bulletList",
            "heading1",
            "heading2",
            "heading3",
            "heading4",
            "heading5",
            "heading6",
            "removeFormatting",
            "eraser",
          ]}
          content={optionText}
          placeholder="Start typing option text here..."
          className="w-[900px] [&_.tiptap-editor]:max-h-[150px]"
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
      )}
      {type === "image" && optionFileImage && (
        <div className="max-w-fit border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={
              optionFileImage instanceof File
                ? URL.createObjectURL(optionFileImage)
                : optionFileImage.url
            }
            alt={optionFileImage.name}
            className="object-contain max-w-full max-h-[300px]"
          />
        </div>
      )}
    </div>
  );
}
