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

type Props = {
  questionnaireSnapshot: AssessmentMaterial[] | null;
  answersFromDb: Answer[];
  attemptId: string;
};

export default function Questionnaire({
  questionnaireSnapshot,
  attemptId,
  answersFromDb,
}: Props) {
  const [answers, setAnswers] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.setAnswers]),
  );

  //set initial answers in global state
  useEffect(() => {
    if (answersFromDb) {
      const answersFormatted: Answer[] = answersFromDb.map((answerFromDb) => ({
        assessmentMaterialId: answerFromDb.assessmentMaterialId,
        materialType: answerFromDb.materialType,
        content: answerFromDb.content,
      }));
      setAnswers(answersFormatted);
    }
  }, [answersFromDb]);

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
        <SubmitButton answers={answers} attemptId={attemptId} />
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
