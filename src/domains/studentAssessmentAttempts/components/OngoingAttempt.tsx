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
import SubmitButton from "./SubmitButton";
import { useShallow } from "zustand/react/shallow";
import { useAttemptRemainingTime } from "../api/queries";
import { useNavigate } from "@tanstack/react-router";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ErrorComponent from "@/components/shared/ErrorComponent";
import OngoingAttemptHeader from "./OngoingAttemptHeader";
import type {
  Answer,
  StudentAssessmentAttemptInfoWithAssessment,
} from "../types";

type Props = {
  questionnaireSnapshot: AssessmentMaterial[] | null;
  answersFromDb: Answer[];
  attemptId: string;
  items: AssessmentMaterial[] | null;
  classId: string;
  studentAssessmentAttemptInfo: StudentAssessmentAttemptInfoWithAssessment;
};

export default function OngoingAttempt({
  questionnaireSnapshot,
  attemptId,
  answersFromDb,
  items,
  studentAssessmentAttemptInfo,
  classId,
}: Props) {
  const [answers, setAnswers, resetState] = useAttemptAnswersStore(
    useShallow((state) => [state.answers, state.setAnswers, state.resetState]),
  );

  const navigate = useNavigate();
  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

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

  const { data: attemptRemainingTime, status: attemptRemainingTimeStatus } =
    useAttemptRemainingTime(attemptId);

  useEffect(() => {
    if (
      attemptRemainingTime &&
      attemptRemainingTime.hasDeadline &&
      attemptRemainingTime.remainingTimeSeconds &&
      attemptRemainingTime.remainingTimeSeconds < 0
    ) {
      navigate({ to: "/lms/classes/$classId", params: { classId } });
      toggleOpenDialog(
        <div className="p-8 flex flex-col justify-center items-center gap-12 bg-white rounded-lg">
          <p className="text-xl font-semibold">This Assessment is closed.</p>
          <button
            onClick={() => toggleOpenDialog(null)}
            className="px-6 py-3 font-medium text-lg text-white rounded-lg bg-mainaccent hover:bg-indigo-800 transition-colors flex items-center gap-2.5"
          >
            <p>OK</p>
          </button>
        </div>,
      );
    }
  }, [attemptRemainingTime]);

  if (attemptRemainingTimeStatus === "pending") {
    return <LoadingComponent />;
  }

  if (attemptRemainingTimeStatus === "error") {
    return <ErrorComponent />;
  }

  if (attemptRemainingTime) {
    if (questionnaireSnapshot && questionnaireSnapshot.length > 0) {
      return (
        <div className="flex flex-col gap-12 w-full">
          <OngoingAttemptHeader
            attemptId={attemptId}
            initialTimeRemaining={attemptRemainingTime.remainingTimeSeconds}
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
                        isReadOnly={false}
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
                        isReadOnly={false}
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
                        isReadOnly={false}
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
            <SubmitButton
              classId={classId}
              items={items}
              answers={answers}
              attemptId={attemptId}
            />
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
}
