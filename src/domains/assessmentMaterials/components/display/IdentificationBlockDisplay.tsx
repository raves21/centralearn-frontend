import { Check, X } from "lucide-react";
import type { AssessmentMaterial, IdentificationItem } from "../../types";
import MaterialQuestionDisplay from "./MaterialQuestionDisplay";

type Props = {
  assessmentMaterial: AssessmentMaterial & { material: IdentificationItem };
};

export default function IdentificationBlockDisplay({
  assessmentMaterial,
}: Props) {
  return (
    <div className="flex flex-col gap-7 p-6 rounded-md border border-gray-300">
      <MaterialQuestionDisplay
        question={assessmentMaterial.question}
        questionNumber={assessmentMaterial.order}
      />
      <div className="flex flex-col gap-5">
        <p className="text-[15px] font-medium">Accepted Answers:</p>
        <div className="flex items-center gap-2">
          <p>Case Sensitive</p>
          {assessmentMaterial.material.isCaseSensitive ? (
            <Check className="stroke-green-500 size-4 stroke-[6px]" />
          ) : (
            <X className="stroke-mainaccent size-4 stroke-[6px]" />
          )}
        </div>
        <div className="flex items-center flex-wrap gap-4">
          {assessmentMaterial.material.acceptedAnswers.map(
            (acceptedAnswer, i) => (
              <p key={i} className="p-2 rounded-md bg-white w-fit">
                {acceptedAnswer}
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
