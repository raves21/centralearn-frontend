import RenderTiptapHTML from "@/components/shared/tiptap/RenderTiptapHTML";
import { cn } from "@/lib/utils";
import type { OptionBasedItemOption } from "@/domains/assessmentMaterials/types";

type Props = {
  option: OptionBasedItemOption;
  index: number;
  isOptionsAlphabetical: boolean;
};

export default function OptionBasedItemBlockOptions({
  option,
  index,
  isOptionsAlphabetical,
}: Props) {
  const alphabetLabel = String.fromCharCode(65 + index);
  return (
    <div className="flex items-center gap-5">
      <div
        className={cn(
          "flex items-center gap-5 bg-white rounded-md p-4 w-full border-gray-200 border",
        )}
      >
        {isOptionsAlphabetical && (
          <p className="font-medium">{alphabetLabel}.</p>
        )}
        {option.optionFile && (
          <div className="max-w-fit border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={option.optionFile.url}
              alt={option.optionFile.name}
              className="object-contain max-w-full max-h-[300px]"
            />
          </div>
        )}
        {option.optionText && (
          <RenderTiptapHTML
            content={option.optionText}
            className="w-full bg-transparent shadow-none p-0"
          />
        )}
      </div>
    </div>
  );
}
