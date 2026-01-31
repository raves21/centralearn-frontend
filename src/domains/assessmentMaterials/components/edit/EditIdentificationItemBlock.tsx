import { useShallow } from "zustand/react/shallow";
import {
  type ContentBlock,
  useManageAssessmentMaterialsStore,
} from "../../stores/useManageAssessmentMaterialsStore";
import type { IdentificationItem } from "../../types";
import { useEffect, useState } from "react";
import EditAssessmentMaterialQuestion from "./EditAssessmentMaterialQuestion";

type Props = {
  block: ContentBlock & { material: IdentificationItem };
};

export default function EditIdentificationItemBlock({ block }: Props) {
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
      <p className="text-lg font-semibold text-gray-400">Identification</p>
      <div className="flex flex-col rounded-lg border border-gray-200 p-4 gap-5">
        <EditAssessmentMaterialQuestion block={block} itemNumber={itemNumber} />
      </div>
    </div>
  );
}
