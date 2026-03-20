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
import SubmitButton from "./SubmitButton";
import { useShallow } from "zustand/react/shallow";
import type { SubmissionSummaryItem } from "../types";

type ReadOnlyAttemptProps = {
  attemptStatus: "submitted";
  submissionSummary: Record<string, SubmissionSummaryItem>;
};

type OngoingAttemptProps = {
  attemptStatus: "ongoing";
};

type Props = {
  questionnaireSnapshot: AssessmentMaterial[] | null;
  answersFromDb: Answer[];
  attemptId: string;
  items: AssessmentMaterial[] | null;
  classId: string;
} & (ReadOnlyAttemptProps | OngoingAttemptProps);

export default function Questionnaire({
  questionnaireSnapshot,
  attemptId,
  answersFromDb,
  items,
  classId,
  ...props
}: Props) {
  const [answers, setAnswers, resetState] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.setAnswers, state.resetState]),
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

  const readOnlyProps = props.attemptStatus === "submitted" ? props : null;

  if (questionnaireSnapshot && questionnaireSnapshot.length > 0) {
    return (
      <div className="flex flex-col gap-8 pb-24">
        <div className="flex flex-col gap-8">
          {questionnaireSnapshot.map((questionnaireItem) => {
            switch (questionnaireItem.materialType) {
              case "App\\Models\\OptionBasedItem":
                return (
                  <OptionBasedItemBlock
                    key={questionnaireItem.id}
                    submissionSummaryItem={
                      readOnlyProps?.submissionSummary[questionnaireItem.id]
                    }
                    isReadOnly={!!readOnlyProps}
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
                    submissionSummaryItem={
                      readOnlyProps?.submissionSummary[questionnaireItem.id]
                    }
                    attemptId={attemptId}
                    isReadOnly={!!readOnlyProps}
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
                    submissionSummaryItem={
                      readOnlyProps?.submissionSummary[questionnaireItem.id]
                    }
                    isReadOnly={!!readOnlyProps}
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
        {props.attemptStatus === "ongoing" && (
          <SubmitButton
            classId={classId}
            items={items}
            answers={answers}
            attemptId={attemptId}
          />
        )}
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
