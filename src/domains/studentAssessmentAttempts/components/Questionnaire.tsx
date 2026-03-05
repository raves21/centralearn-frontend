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
  attemptId: string;
};

export default function Questionnaire({
  questionnaireSnapshot,
  attemptId,
}: Props) {
  const [answers, setAnswers] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.setAnswers]),
  );

  //set initial answers in global state
  useEffect(() => {
    if (questionnaireSnapshot) {
      const answersFormatted: Answer[] = questionnaireSnapshot.map((item) => ({
        materialId: item.materialId,
        materialType:
          item.materialType === "App\\Models\\EssayItem"
            ? "essay_item"
            : item.materialType === "App\\Models\\IdentificationItem"
              ? "identification_item"
              : "option_based_item",
        content: null,
      }));
      setAnswers(answersFormatted);
    }
  }, [questionnaireSnapshot]);

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
