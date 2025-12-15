import { Loader } from "lucide-react";
import { useAllLectureMaterials } from "../api/queries";
import TextLectureMaterialBlockDisplay from "./TextLectureMaterialBlockDisplay";
import FileLectureMaterialBlockDisplay from "./FileLectureMaterialBlockDisplay";
import type { FileAttachment, TextAttachment } from "@/utils/sharedTypes";

type Props = {
  lectureId: string;
};

export default function LectureMaterialsList({ lectureId }: Props) {
  const { data: lectureMaterials, status: lectureMaterialsStatus } =
    useAllLectureMaterials({ lectureId });

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
