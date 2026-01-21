import { useAllAssessmentMaterials } from "../api/queries";
// import TextLectureMaterialBlockDisplay from "./TextLectureMaterialBlockDisplay";
// import FileLectureMaterialBlockDisplay from "./FileLectureMaterialBlockDisplay";
import LoadingComponent from "@/components/shared/LoadingComponent";

type Props = {
  assessmentId: string;
};

import ErrorComponent from "@/components/shared/ErrorComponent";
import OptionBasedBlockDisplay from "./OptionBasedBlockDisplay";
import EssayBlockDisplay from "./EssayBlockDisplay";
import IdentificationBlockDisplay from "./IdentificationBlockDisplay";

export default function AssessmentMaterialsList({ assessmentId }: Props) {
  const { data: assessmentMaterials, status: assessmentMaterialsStatus } =
    useAllAssessmentMaterials({ assessmentId });

  if ([assessmentMaterialsStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([assessmentMaterialsStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (assessmentMaterials) {
    return (
      <div className="flex flex-col gap-8 pb-24">
        {assessmentMaterials.map((assessmentMaterial) => {
          switch (assessmentMaterial.materialType) {
            case "App\\Models\\OptionBasedItem":
              return <OptionBasedBlockDisplay key={assessmentMaterial.id} />;
            case "App\\Models\\EssayItem":
              return <EssayBlockDisplay key={assessmentMaterial.id} />;
            case "App\\Models\\IdentificationItem":
              return <IdentificationBlockDisplay key={assessmentMaterial.id} />;
          }
        })}
      </div>
    );
  }
}
