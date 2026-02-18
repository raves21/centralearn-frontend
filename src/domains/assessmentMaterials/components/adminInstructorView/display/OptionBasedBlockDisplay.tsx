import type { AssessmentMaterial, OptionBasedItem } from "../../../types";
import MaterialQuestionDisplay from "./MaterialQuestionDisplay";
import OptionBasedItemOptionDisplay from "./OptionBasedItemOptionDisplay";

type Props = {
  assessmentMaterial: AssessmentMaterial & { material: OptionBasedItem };
};

export default function OptionBasedBlockDisplay({ assessmentMaterial }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-md border border-gray-300">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Option Based</p>
        <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
          {assessmentMaterial.pointWorth} point
          {assessmentMaterial.pointWorth > 1 && <span>s</span>}
        </div>
      </div>
      <MaterialQuestionDisplay
        question={assessmentMaterial.question}
        questionNumber={assessmentMaterial.order}
      />
      <div className="flex flex-col gap-6">
        <p className="text-[15px] font-medium">Options:</p>
        <div className="flex flex-col gap-4">
          {assessmentMaterial.material.options.map((option, index) => (
            <OptionBasedItemOptionDisplay
              key={index}
              option={option}
              index={index}
              isOptionsAlphabetical={
                assessmentMaterial.material.isOptionsAlphabetical
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
