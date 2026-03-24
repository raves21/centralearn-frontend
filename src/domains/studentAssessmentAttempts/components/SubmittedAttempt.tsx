import type {
  AssessmentMaterial,
  EssayItem,
  IdentificationItem,
  OptionBasedItem,
} from "@/domains/assessmentMaterials/types";
import OptionBasedItemBlock from "./OptionBasedItemBlock";
import EssayItemBlock from "./EssayItemBlock";
import IdentificationItemBlock from "./IdentificationItemBlock";
import {
  useAttemptAnswersStore,
  type Answer,
} from "../stores/useAttemptAnswersStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import type {
  StudentAssessmentAttemptInfoWithAssessment,
  SubmissionSummaryItem,
} from "../types";
import SubmittedAttemptHeader from "./SubmittedAttemptHeader";

type Props = {
  questionnaireSnapshot: AssessmentMaterial[] | null;
  answersFromDb: Answer[];
  attemptId: string;
  submissionSummary: Record<string, SubmissionSummaryItem>;
  classId: string;
  studentAssessmentAttemptInfo: StudentAssessmentAttemptInfoWithAssessment;
};

export default function SubmittedAttempt({
  questionnaireSnapshot,
  attemptId,
  answersFromDb,
  submissionSummary,
  classId,
  studentAssessmentAttemptInfo,
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

  if (questionnaireSnapshot && questionnaireSnapshot.length > 0) {
    return (
      <div className="flex flex-col gap-12 w-full">
        <SubmittedAttemptHeader
          classId={classId}
          studentAssessmentAttemptInfo={studentAssessmentAttemptInfo}
        />
        <div className="flex flex-col gap-8 pb-24">
          <div className="flex flex-col gap-8">
            {questionnaireSnapshot.map((questionnaireItem) => {
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
                          materialable: OptionBasedItem;
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
                          materialable: EssayItem;
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
                          materialable: IdentificationItem;
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
