import type {
  AssessmentMaterial,
  EssayItem,
  IdentificationItem,
  OptionBasedItem,
} from "@/domains/assessmentMaterials/types";
import OptionBasedItemBlock from "./OptionBasedItemBlock";
import EssayItemBlock from "./EssayItemBlock";
import IdentificationItemBlock from "./IdentificationItemBlock";

type Props = {
  questionnaireSnapshot: AssessmentMaterial[] | null;
};

export default function Questionnaire({ questionnaireSnapshot }: Props) {
  if (questionnaireSnapshot && questionnaireSnapshot.length > 0) {
    return (
      <div className="flex flex-col gap-8 pb-24">
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
    );
  } else {
    return (
      <div className="w-full grid place-items-center py-24">
        <p className="font-medium text-base">This assessment is empty.</p>
      </div>
    );
  }
}
