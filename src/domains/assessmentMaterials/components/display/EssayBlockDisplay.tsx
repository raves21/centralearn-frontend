import type { AssessmentMaterial, EssayItem } from "../../types";
import MaterialQuestionDisplay from "./MaterialQuestionDisplay";

type Props = {
  assessmentMaterial: AssessmentMaterial & { material: EssayItem };
};

export default function EssayBlockDisplay({ assessmentMaterial }: Props) {
  return (
    <div className="flex flex-col gap-7 p-6 rounded-md border border-gray-300">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Essay</p>
        <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
          {assessmentMaterial.pointWorth} point
          {assessmentMaterial.pointWorth > 1 && <span>s</span>}
        </div>
      </div>
      <MaterialQuestionDisplay
        question={assessmentMaterial.question}
        questionNumber={assessmentMaterial.order}
      />
      <div className="grid grid-cols-2 gap-6 w-fit rounded-md p-5 border border-gray-300">
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Minimum Words:</p>
          {assessmentMaterial.material.minWordCount ? (
            <p className="text-mainaccent">
              {assessmentMaterial.material.minWordCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Maximum Words:</p>
          {assessmentMaterial.material.maxWordCount ? (
            <p className="text-mainaccent">
              {assessmentMaterial.material.maxWordCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Minimum Characters:</p>
          {assessmentMaterial.material.minCharacterCount ? (
            <p className="text-mainaccent">
              {assessmentMaterial.material.minCharacterCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        <div className="flex items-center gap-4 justify-between">
          <p className="whitespace-nowrap font-medium">Maximum Characters:</p>
          {assessmentMaterial.material.maxCharacterCount ? (
            <p className="text-mainaccent">
              {assessmentMaterial.material.maxCharacterCount}
            </p>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
      </div>
    </div>
  );
}
