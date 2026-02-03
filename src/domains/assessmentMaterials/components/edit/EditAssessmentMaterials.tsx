import {
  ContentType,
  type ChapterContent,
} from "@/domains/chapterContents/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { useProcessBulkAssessmentMaterials } from "../../api/mutaions";
import { usePendingOverlay } from "@/components/shared/globals/utils/usePendingOverlay";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookOpen, NotebookPen, X, Check, Plus } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useSetTopPanelPointerEventsWhenDragging } from "@/utils/hooks/useSetTopPanelPointerEventsWhenDragging";
import { useAllAssessmentMaterials } from "../../api/queries";
import { useManageAssessmentMaterialsStore } from "../../stores/useManageAssessmentMaterialsStore";
import { useShallow } from "zustand/react/shallow";
import { useGlobalStore } from "@/components/shared/globals/utils/useGlobalStore";
import AddAssessmentMaterialBlockDialog from "./AddAssessmentMaterialBlockDialog";
import { useEffect } from "react";
import EditAssessmentMaterialBlock from "./EditAssessmentMaterialBlock";
import type {
  EssayItem,
  IdentificationItem,
  OptionBasedItem,
} from "../../types";

type Props = {
  chapterContentInfo: ChapterContent;
  classId: string;
};

export default function EditAssessmentMaterials({
  chapterContentInfo,
  classId,
}: Props) {
  const navigate = useNavigate();

  const {
    mutateAsync: processBulkAssessmentMaterials,
    status: processBulkAssessmentMaterialsStatus,
  } = useProcessBulkAssessmentMaterials();

  usePendingOverlay({
    isPending: processBulkAssessmentMaterialsStatus === "pending",
    pendingLabel: "Saving",
  });

  const [blocks, setBlocks, updateBlocks, addBlock] =
    useManageAssessmentMaterialsStore(
      useShallow((state) => [
        state.blocks,
        state.setBlocks,
        state.updateBlocks,
        state.addBlock,
      ]),
    );

  const toggleOpenDialog = useGlobalStore((state) => state.toggleOpenDialog);

  const { data: assessmentMaterials } = useAllAssessmentMaterials({
    assessmentId: chapterContentInfo.contentId,
  });

  useEffect(() => {
    if (assessmentMaterials) {
      const hydratedBlocks = assessmentMaterials.map((assessmentMaterial) => {
        // Map Laravel model type to simple type name
        let materialType:
          | "optionBasedItem"
          | "essayItem"
          | "identificationItem";

        let material;
        switch (assessmentMaterial.materialType) {
          case "App\\Models\\OptionBasedItem":
            materialType = "optionBasedItem";
            const optionBasedItem =
              assessmentMaterial.material as OptionBasedItem;
            material = {
              options: optionBasedItem.options,
              isAlphabeticalOrder: true
            };
            break;
          case "App\\Models\\EssayItem":
            materialType = "essayItem";
            const essayItem = assessmentMaterial.material as EssayItem;
            material = {
              maxCharacterCount: essayItem.maxCharacterCount,
              minCharacterCount: essayItem.minCharacterCount,
              maxWordCount: essayItem.maxWordCount,
              minWordCount: essayItem.minWordCount,
            };
            break;
          case "App\\Models\\IdentificationItem":
            materialType = "identificationItem";
            const identificationItem =
              assessmentMaterial.material as IdentificationItem;
            material = {
              acceptedAnswers: identificationItem.acceptedAnswers,
            };
            break;
        }

        return {
          id: crypto.randomUUID(),
          dbId: assessmentMaterial.id,
          materialQuestion: {
            id: assessmentMaterial.question.id,
            questionText: assessmentMaterial.question.questionText,
            questionFiles: assessmentMaterial.question.questionFiles,
          },
          pointWorth: assessmentMaterial.pointWorth,
          materialType,
          material,
        };
      });
      setBlocks(hydratedBlocks);
    }
  }, [assessmentMaterials]);

  const { setIsDragging } = useSetTopPanelPointerEventsWhenDragging();

  return (
    <div className="flex flex-col gap-12 w-full pb-12">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link
                    to="/lms/classes/$classId"
                    params={{
                      classId,
                    }}
                  >
                    {chapterContentInfo.chapter.name}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{chapterContentInfo.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            {chapterContentInfo.contentType === ContentType.Lecture && (
              <BookOpen className="size-8" />
            )}
            {chapterContentInfo.contentType === ContentType.Assessment && (
              <NotebookPen className="size-8" />
            )}
            <p className="text-2xl font-bold">{chapterContentInfo.name}</p>
          </div>
        </div>
        <div className="flex gap-8">
          <button
            onClick={() =>
              navigate({
                to: "/lms/classes/$classId/contents/$chapterContentId",
                params: {
                  chapterContentId: chapterContentInfo.id,
                  classId,
                },
              })
            }
            className="px-4 py-2 rounded-md border border-mainaccent text-mainaccent hover:bg-mainaccent/10 transition-colors flex items-center gap-3"
          >
            <X className="size-4" />
            <p>Exit edit mode</p>
          </button>
          <button
            onClick={async () => {}}
            className="px-4 py-2 rounded-md bg-mainaccent text-white flex items-center gap-3"
          >
            <Check className="size-4" />
            <p>Save changes</p>
          </button>
        </div>
      </div>
      <ReactSortable
        list={blocks}
        setList={updateBlocks}
        handle=".drag-handle"
        animation={150}
        scroll={true}
        scrollSensitivity={100}
        scrollSpeed={10}
        className="flex flex-col gap-12"
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      >
        {blocks.map((block) => (
          <EditAssessmentMaterialBlock block={block} key={block.id} />
        ))}
      </ReactSortable>
      <button
        onClick={() =>
          toggleOpenDialog(
            <AddAssessmentMaterialBlockDialog
              onClickEssay={() => {
                addBlock("essayItem");
                toggleOpenDialog(null);
              }}
              onClickIdentification={() => {
                addBlock("identificationItem");
                toggleOpenDialog(null);
              }}
              onClickOptionBased={() => {
                addBlock("optionBasedItem");
                toggleOpenDialog(null);
              }}
            />,
          )
        }
        className="flex justify-center items-center gap-4 bg-gray-200 border-2 hover:bg-gray-300 transition-colors rounded-md border-dashed border-gray-700/50 w-full h-[100px]"
      >
        <Plus className="size-8 stroke-gray-500" />
        <p className="font-medium text-gray-500 text-lg">Add Item</p>
      </button>
    </div>
  );
}
