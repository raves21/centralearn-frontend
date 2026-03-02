import { Input } from "@/components/ui/input";
import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  IdentificationItem,
} from "@/domains/assessmentMaterials/types";

type Props = {
  questionnaireItem: AssessmentMaterial & { materialable: IdentificationItem };
};

export default function IdentificationItemBlock({ questionnaireItem }: Props) {
  return (
    <div className="flex flex-col gap-7 p-6 rounded-md bg-white">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Identification</p>
        <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
          {questionnaireItem.pointWorth} point
          {questionnaireItem.pointWorth > 1 && <span>s</span>}
        </div>
      </div>
      <MaterialQuestionDisplay
        question={questionnaireItem.question}
        questionNumber={questionnaireItem.order}
      />
      <div className="flex flex-col gap-5 w-[400px]">
        <p className="text-[15px] font-medium">Answer</p>
        <Input />
      </div>
    </div>
  );
}
