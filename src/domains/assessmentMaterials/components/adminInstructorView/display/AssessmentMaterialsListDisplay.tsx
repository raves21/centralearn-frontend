import { useAllAssessmentMaterials } from "../../../api/queries";
import ShowLoadingComponent from "@/components/shared/LoadingComponent";

type Props = {
  assessmentId: string;
};

import ShowErrorComponent from "@/components/shared/ErrorComponent";
import OptionBasedBlockDisplay from "./OptionBasedItemBlockDisplay";
import EssayBlockDisplay from "./EssayBlockDisplay";
import IdentificationBlockDisplay from "./IdentificationBlockDisplay";
import type {
  AssessmentMaterial,
  EssayItem,
  IdentificationItem,
  OptionBasedItem,
} from "../../../types";

export default function AssessmentMaterialsListDisplay({
  assessmentId,
}: Props) {
  const { data: assessmentMaterials, status: assessmentMaterialsStatus } =
    useAllAssessmentMaterials({ assessmentId });

  if ([assessmentMaterialsStatus].includes("error")) {
    return <ShowErrorComponent />;
  }

  if ([assessmentMaterialsStatus].includes("pending")) {
    return <ShowLoadingComponent />;
  }

  if (assessmentMaterials) {
    return (
      <div className="flex flex-col gap-8 pb-24">
        {assessmentMaterials.map((assessmentMaterial) => {
          switch (assessmentMaterial.materialType) {
            case "App\\Models\\OptionBasedItem":
              return (
                <OptionBasedBlockDisplay
                  key={assessmentMaterial.id}
                  assessmentMaterial={
                    assessmentMaterial as AssessmentMaterial & {
                      material: OptionBasedItem;
                    }
                  }
                />
              );
            case "App\\Models\\EssayItem":
              return (
                <EssayBlockDisplay
                  key={assessmentMaterial.id}
                  assessmentMaterial={
                    assessmentMaterial as AssessmentMaterial & {
                      material: EssayItem;
                    }
                  }
                />
              );
            case "App\\Models\\IdentificationItem":
              return (
                <IdentificationBlockDisplay
                  key={assessmentMaterial.id}
                  assessmentMaterial={
                    assessmentMaterial as AssessmentMaterial & {
                      material: IdentificationItem;
                    }
                  }
                />
              );
          }
        })}
      </div>
    );
  }
}
