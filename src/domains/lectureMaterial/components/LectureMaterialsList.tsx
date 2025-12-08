import { Loader } from "lucide-react";
import { useLectureAllMaterials } from "../api/queries";
import TextLectureMaterialBlock from "./TextLectureMaterialBlock";
import FileLectureMaterialBlockDisplay from "./FileLectureMaterialBlockDisplay";
import type { FileAttachment, TextAttachment } from "@/utils/sharedTypes";

type Props = {
  lectureId: string;
};

export default function LectureMaterialsList({ lectureId }: Props) {
  const { data: lectureMaterials, status: lectureMaterialsStatus } =
    useLectureAllMaterials(lectureId);

  if ([lectureMaterialsStatus].includes("error")) {
    return (
      <div className="size-full grid place-items-center">An error occured.</div>
    );
  }

  if ([lectureMaterialsStatus].includes("pending")) {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (lectureMaterials) {
    return (
      <div className="flex flex-col gap-8">
        {lectureMaterials.map((lectureMaterial) => {
          const isTextMaterial =
            lectureMaterial.materialType === "App\\Models\\TextAttachment";

          return (
            <div key={lectureMaterial.id}>
              {isTextMaterial ? (
                <TextLectureMaterialBlock
                  material={lectureMaterial.material as TextAttachment}
                />
              ) : (
                <FileLectureMaterialBlockDisplay
                  material={lectureMaterial.material as FileAttachment}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
