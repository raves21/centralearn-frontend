import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import {
  useManageAssessmentMaterialsStore,
  type ContentBlock,
} from "../../stores/useManageAssessmentMaterialsStore";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  itemNumber: number;
  block: ContentBlock;
};

export default function EditAssessmentMaterialQuestion({
  itemNumber,
  block,
}: Props) {
  const [updateBlock, recalculateAssessmentTotalPoints] =
    useManageAssessmentMaterialsStore(
      useShallow((state) => [
        state.updateBlock,
        state.recalculateAssessmentTotalPoints,
      ]),
    );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pointWorthInputValue, setPointWorthInputValue] = useState<string>(
    block.pointWorth?.toString() || "",
  );

  useEffect(() => {
    setPointWorthInputValue(block.pointWorth?.toString() || "");
  }, [block.pointWorth]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      updateBlock(block.id, {
        ...block,
        materialQuestion: {
          ...block.materialQuestion,
          questionFiles: [...block.materialQuestion.questionFiles, ...newFiles],
        },
      });
      e.target.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    updateBlock(block.id, {
      ...block,
      materialQuestion: {
        ...block.materialQuestion,
        questionFiles: block.materialQuestion.questionFiles.filter(
          (_, idx) => idx !== indexToRemove,
        ),
      },
    });
  };

  const fileCount = block.materialQuestion.questionFiles.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">Question {itemNumber}</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="font-semibold text-lg">Point worth:</p>
            <Input
              className="w-20 text-lg"
              type="number"
              value={pointWorthInputValue}
              onChange={(e) => {
                setPointWorthInputValue(e.currentTarget.value);
              }}
              onBlur={(e) => {
                const value = e.currentTarget.value;
                const numValue = value === "" ? 0 : Number(value);
                updateBlock(block.id, {
                  ...block,
                  pointWorth: numValue,
                });
                recalculateAssessmentTotalPoints();
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
      <div>
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        {fileCount === 0 ? (
          <button
            className="flex items-center gap-1 text-mainaccent border border-mainaccent rounded-md p-2 hover:bg-gray-200 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            Attach files <Plus className="size-4 ml-2" />
          </button>
        ) : (
          <div className="flex flex-row flex-wrap gap-4 items-center">
            {block.materialQuestion.questionFiles.map((file, idx) => (
              <div
                // independent of file type (File object or FileAttachment), 'name' is present
                key={idx}
                className="px-3 py-2 border rounded-md bg-white text-sm font-medium shadow-sm flex items-center gap-2"
              >
                {file.name}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="hover:text-red-500 transition-colors p-1"
                >
                  <X className="size-5" />
                </button>
              </div>
            ))}
            <button
              className="flex items-center gap-1 text-mainaccent border border-mainaccent rounded-md p-2 hover:bg-gray-200 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              Add file <Plus className="size-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
