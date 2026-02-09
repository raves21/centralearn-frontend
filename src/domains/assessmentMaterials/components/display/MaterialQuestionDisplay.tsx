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
          <div
            className="prose prose-lg max-w-none tiptap-editor p-4 rounded-lg bg-white shadow-sm"
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          />
        )}
        <div className="flex flex-col gap-4">
          <p className="text-[15px] font-medium">Attachments:</p>
          {!!question.questionFiles && !!question.questionFiles.length && (
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
          )}
        </div>
      </div>
    </div>
  );
}
