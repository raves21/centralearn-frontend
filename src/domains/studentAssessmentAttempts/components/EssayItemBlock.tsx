import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import MaterialQuestionDisplay from "@/domains/assessmentMaterials/components/adminInstructorView/display/MaterialQuestionDisplay";
import type {
  AssessmentMaterial,
  EssayItem,
} from "@/domains/assessmentMaterials/types";

type Props = {
  questionnaireItem: AssessmentMaterial & { materialable: EssayItem };
};

export default function EssayItemBlock({ questionnaireItem }: Props) {
  return (
    <div className="flex flex-col gap-7 p-6 rounded-md bg-white">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-400">Essay</p>
        <div className="font-semibold text-mainaccent border border-mainaccent rounded-md px-3 py-2">
          {questionnaireItem.pointWorth} point
          {questionnaireItem.pointWorth > 1 && <span>s</span>}
        </div>
      </div>
      <MaterialQuestionDisplay
        question={questionnaireItem.question}
        questionNumber={questionnaireItem.order}
      />
      <TiptapEditor content="" onChange={() => {}} />
    </div>
  );
}
