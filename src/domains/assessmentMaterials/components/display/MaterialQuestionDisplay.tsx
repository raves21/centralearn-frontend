import RenderTiptapHTML from "@/components/shared/tiptap/RenderTiptapHTML";
import type { AssessmentMaterialQuestion } from "../../types";

type Props = {
  questionNumber: number;
  question: AssessmentMaterialQuestion;
};

export default function MaterialQuestionDisplay({
  question,
  questionNumber,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-semibold text-lg">Question {questionNumber}</p>
      <div className="flex flex-col gap-4">
        {question.questionText && (
          <RenderTiptapHTML content={question.questionText} />
        )}
        <div className="flex flex-col gap-4">
          {!!question.questionFiles && !!question.questionFiles.length && (
            <>
              <p className="text-[15px] font-medium">Attachments:</p>
              <div className="flex items-center flex-wrap gap-4">
                {question.questionFiles.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    className="px-3 py-2 text-blue-600 hover:cursor-pointer rounded-md bg-white font-medium shadow-sm flex items-center gap-2"
                  >
                    {file.name}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
