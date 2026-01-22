import { useAllLectureMaterials } from "../../api/queries";
import TextLectureMaterialBlockDisplay from "./TextLectureMaterialBlockDisplay";
import FileLectureMaterialBlockDisplay from "./FileLectureMaterialBlockDisplay";
import type { FileAttachment, TextAttachment } from "@/utils/sharedTypes";
import LoadingComponent from "@/components/shared/LoadingComponent";

type Props = {
  lectureId: string;
};

import ErrorComponent from "@/components/shared/ErrorComponent";

export default function LectureMaterialsListDisplay({ lectureId }: Props) {
  const { data: lectureMaterials, status: lectureMaterialsStatus } =
    useAllLectureMaterials({ lectureId });

  if ([lectureMaterialsStatus].includes("error")) {
    return <ErrorComponent />;
  }

  if ([lectureMaterialsStatus].includes("pending")) {
    return <LoadingComponent />;
  }

  if (lectureMaterials) {
    return (
      <div className="flex flex-col gap-8 pb-24">
        {lectureMaterials.map((lectureMaterial) => {
          const isTextMaterial =
            lectureMaterial.materialType === "App\\Models\\TextAttachment";

          if (isTextMaterial)
            return (
              <TextLectureMaterialBlockDisplay
                key={lectureMaterial.id}
                material={lectureMaterial.material as TextAttachment}
              />
            );
          return (
            <FileLectureMaterialBlockDisplay
              key={lectureMaterial.id}
              material={lectureMaterial.material as FileAttachment}
            />
          );
        })}
      </div>
    );
  }
}
