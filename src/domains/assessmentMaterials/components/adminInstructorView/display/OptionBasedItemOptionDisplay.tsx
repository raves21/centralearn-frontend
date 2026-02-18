import RenderTiptapHTML from "@/components/shared/tiptap/RenderTiptapHTML";
import type { OptionBasedItemOption } from "../../../types";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  option: OptionBasedItemOption;
  index: number;
  isOptionsAlphabetical: boolean;
};

export default function OptionBasedItemOptionDisplay({
  option,
  index,
  isOptionsAlphabetical,
}: Props) {
  const alphabetLabel = String.fromCharCode(65 + index);
  return (
    <div className="flex items-center gap-5">
      {option.isCorrect ? (
        <Check className="size-4 stroke-[6px] stroke-green-500" />
      ) : (
        <X className="size-4 stroke-[6px] stroke-mainaccent" />
      )}
      <div
        className={cn(
          "flex items-center gap-5 bg-white rounded-md p-4 w-full",
          {
            "bg-green-100": option.isCorrect,
          },
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
