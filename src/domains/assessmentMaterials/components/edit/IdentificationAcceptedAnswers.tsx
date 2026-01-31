import {
  useManageAssessmentMaterialsStore,
  type ContentBlock,
} from "../../stores/useManageAssessmentMaterialsStore";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  block: ContentBlock & { material: { acceptedAnswers: string[] } };
  answer: string;
  index: number;
};

export default function IdentificationAcceptedAnswer({
  block,
  answer,
  index,
}: Props) {
  const updateBlock = useManageAssessmentMaterialsStore(
    (state) => state.updateBlock,
  );

  function removeAcceptedAnswer(index: number) {
    updateBlock(block.id, {
      ...block,
      material: {
        acceptedAnswers: block.material.acceptedAnswers.filter(
          (_, i) => i !== index,
        ),
      },
    });
  }

  function setAcceptedAnswer(answer: string) {
    updateBlock(block.id, {
      ...block,
      material: {
        acceptedAnswers: block.material.acceptedAnswers.map((ans, ansIndex) => {
          if (ansIndex === index) {
            return answer;
          }
          return ans;
        }),
      },
    });
  }

  return (
    <div className="p-2 flex items-center gap-1">
      <Input
        className="w-[250px]"
        value={answer}
        onChange={(e) => setAcceptedAnswer(e.currentTarget.value)}
      />
      <button
        className="p-1 hover:text-red-500 transition-colors rounded-md"
        onClick={() => removeAcceptedAnswer(index)}
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
