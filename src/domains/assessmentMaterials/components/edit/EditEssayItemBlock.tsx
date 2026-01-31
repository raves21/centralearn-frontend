import {
  useManageAssessmentMaterialsStore,
  type ContentBlock,
} from "../../stores/useManageAssessmentMaterialsStore";
import { useShallow } from "zustand/react/shallow";
import type { EssayItem } from "../../types";
import { useEffect, useState } from "react";
import EditAssessmentMaterialQuestion from "./EditAssessmentMaterialQuestion";

type Props = {
  block: ContentBlock & { material: EssayItem };
};

export default function EditEssayItemBlock({ block }: Props) {
  const [blocks] = useManageAssessmentMaterialsStore(
    useShallow((state) => [state.blocks]),
  );

  const [itemNumber, setItemNumber] = useState(0);

  useEffect(() => {
    const index = blocks.findIndex((b) => b.id === block.id);
    setItemNumber(index + 1);
  }, [blocks]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-gray-400">Essay</p>
      <div className="flex flex-col rounded-lg border border-gray-200 p-4 gap-5">
        <EditAssessmentMaterialQuestion block={block} itemNumber={itemNumber} />
      </div>
    </div>
  );
}
