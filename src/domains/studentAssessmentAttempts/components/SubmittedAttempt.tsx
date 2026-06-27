import type {
  AssessmentMaterial,
  EssayItem,
  IdentificationItem,
  OptionBasedItem,
} from "@/domains/assessmentMaterials/types";
import OptionBasedItemBlock from "./OptionBasedItemBlock";
import EssayItemBlock from "./EssayItemBlock";
import IdentificationItemBlock from "./IdentificationItemBlock";
import { useAttemptAnswersStore } from "../stores/useAttemptAnswersStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Answer, SubmissionSummaryItem } from "../types";
import SubmittedAttemptHeader from "./SubmittedAttemptHeader";

type Props = {
  questionnaireItems: AssessmentMaterial[] | null;
  answersFromDb: Answer[];
  attemptId: string;
  submissionSummary: Record<string, SubmissionSummaryItem>;
  classId: string;
  assessmentName: string;
  chapterName: string;
};

export default function SubmittedAttempt({
  questionnaireItems,
  attemptId,
  answersFromDb,
  submissionSummary,
  classId,
  assessmentName,
  chapterName,
}: Props) {
  const [setAnswers, resetState] = useAttemptAnswersStore(
    useShallow((state) => [state.setAnswers, state.resetState]),
  );

  useEffect(() => {
    //reset global state on mount
    resetState();
    //set original answers
    const answersFormatted: Answer[] = answersFromDb.map((answerFromDb) => ({
      assessmentMaterialId: answerFromDb.assessmentMaterialId,
      materialType: answerFromDb.materialType,
      content: answerFromDb.content,
    }));
    setAnswers(answersFormatted);

    //reset the global state on unmount
    return () => {
      resetState();
    };
  }, [answersFromDb]);

  if (questionnaireItems && questionnaireItems.length > 0) {
    return (
      <div className="flex flex-col gap-12 w-full">
        <SubmittedAttemptHeader
          classId={classId}
          assessmentName={assessmentName}
          chapterName={chapterName}
        />
        <div className="flex flex-col gap-8 pb-24">
          <div className="flex flex-col gap-8">
            {questionnaireItems.map((questionnaireItem) => {
              switch (questionnaireItem.materialType) {
                case "App\\Models\\OptionBasedItem":
                  return (
                    <OptionBasedItemBlock
                      key={questionnaireItem.id}
                      isReadOnly={true}
                      submissionSummaryItem={
                        submissionSummary[questionnaireItem.id]
                      }
                      attemptId={attemptId}
                      questionnaireItem={
                        questionnaireItem as AssessmentMaterial & {
                          material: OptionBasedItem;
                        }
                      }
                    />
                  );
                case "App\\Models\\EssayItem":
                  return (
                    <EssayItemBlock
                      attemptId={attemptId}
                      isReadOnly={true}
                      submissionSummaryItem={
                        submissionSummary[questionnaireItem.id]
                      }
                      key={questionnaireItem.id}
                      questionnaireItem={
                        questionnaireItem as AssessmentMaterial & {
                          material: EssayItem;
                        }
                      }
                    />
                  );
                case "App\\Models\\IdentificationItem":
                  return (
                    <IdentificationItemBlock
                      key={questionnaireItem.id}
                      isReadOnly={true}
                      submissionSummaryItem={
                        submissionSummary[questionnaireItem.id]
                      }
                      attemptId={attemptId}
                      questionnaireItem={
                        questionnaireItem as AssessmentMaterial & {
                          material: IdentificationItem;
                        }
                      }
                    />
                  );
              }
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full grid place-items-center py-24">
        <p className="font-medium text-base">This assessment is empty.</p>
      </div>
    );
  }
}
