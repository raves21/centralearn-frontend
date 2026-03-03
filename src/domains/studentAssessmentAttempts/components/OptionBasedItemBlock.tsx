import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  OptionBasedItem,
} from "@/domains/assessmentMaterials/types";
import OptionBasedItemBlockOptions from "./OptionBasedItemBlockOptions";

type Props = {
  questionnaireItem: AssessmentMaterial & { materialable: OptionBasedItem };
};

export default function OptionBasedItemBlock({ questionnaireItem }: Props) {
  return (
    <div
      id={questionnaireItem.materialId}
      className="flex flex-col gap-6 p-6 rounded-md bg-white"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Option Based</p>
        <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
          {questionnaireItem.pointWorth} point
          {questionnaireItem.pointWorth > 1 && <span>s</span>}
        </div>
      </div>
      <MaterialQuestionDisplay
        question={questionnaireItem.question}
        questionNumber={questionnaireItem.order}
      />
      <div className="flex flex-col gap-6">
        <p className="text-[15px] font-medium">Options:</p>
        <div className="flex flex-col gap-4">
          {questionnaireItem.materialable.options.map((option, index) => (
            <OptionBasedItemBlockOptions
              key={index}
              option={option}
              materialId={questionnaireItem.materialId}
              index={index}
              isOptionsAlphabetical={
                questionnaireItem.materialable.isOptionsAlphabetical
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
