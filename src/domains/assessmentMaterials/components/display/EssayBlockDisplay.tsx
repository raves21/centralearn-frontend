import type { AssessmentMaterial, EssayItem } from "../../types";
import MaterialQuestionDisplay from "./MaterialQuestionDisplay";

type Props = {
  assessmentMaterial: AssessmentMaterial & { material: EssayItem };
};

export default function EssayBlockDisplay({ assessmentMaterial }: Props) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-md border border-gray-300">
      <MaterialQuestionDisplay
        question={assessmentMaterial.question}
        questionNumber={assessmentMaterial.order}
      />
    </div>
  );
}
