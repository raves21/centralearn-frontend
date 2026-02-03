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
import {
  useManageAssessmentMaterialsStore,
  type EssayItemBlock,
  type IdentificationItemBlock,
  type OptionBasedItemBlock,
} from "../../stores/useManageAssessmentMaterialsStore";
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
import { toast } from "sonner";
import { isEqual } from "lodash";
import ConfirmationDialog from "@/components/shared/globals/ConfirmationDialog";

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
              isAlphabeticalOrder: true,
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
              isCaseSensitive: identificationItem.isCaseSensitive,
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

  async function onSaveChanges() {
    const formData = new FormData();

    try {
      blocks.forEach((block, blockIndex) => {
        formData.append("assessment_id", chapterContentInfo.contentId);
        if (block.dbId) {
          formData.append(`materials[${blockIndex}][id]`, block.dbId);
        }

        let materialType;
        switch (block.materialType) {
          case "essayItem":
            materialType = "essay_item";
            break;
          case "identificationItem":
            materialType = "identification_item";
            break;
          case "optionBasedItem":
            materialType = "option_based_item";
        }

        //assessment material general info
        formData.append(
          `materials[${blockIndex}][material_type]`,
          materialType,
        );
        formData.append(
          `materials[${blockIndex}][order]`,
          (blockIndex + 1).toString(),
        );
        formData.append(
          `materials[${blockIndex}][point_worth]`,
          block.pointWorth.toString(),
        );

        //assessment material question
        formData.append(
          `materials[${blockIndex}][question][question_text]`,
          block.materialQuestion.questionText,
        );

        if (block.materialQuestion.questionFiles.length !== 0) {
          block.materialQuestion.questionFiles.forEach(
            (questionFile, index) => {
              if (questionFile instanceof File) {
                formData.append(
                  `materials[${blockIndex}][question][new_question_files][${index}]`,
                  questionFile,
                );
              } else {
                formData.append(
                  `materials[${blockIndex}][question][new_question_files][${index}]`,
                  JSON.stringify(questionFile),
                );
              }
            },
          );
        }

        //MATERIAL TYPE SPECIFIC
        switch (block.materialType) {
          case "essayItem":
            const essayMaterial = block.material as EssayItemBlock;
            if (essayMaterial.minCharacterCount)
              formData.append(
                `materials[${blockIndex}][essay_item][min_character_count]`,
                essayMaterial.minCharacterCount.toString(),
              );
            if (essayMaterial.maxCharacterCount)
              formData.append(
                `materials[${blockIndex}][essay_item][max_character_count]`,
                essayMaterial.maxCharacterCount.toString(),
              );
            if (essayMaterial.minWordCount)
              formData.append(
                `materials[${blockIndex}][essay_item][min_word_count]`,
                essayMaterial.minWordCount.toString(),
              );
            if (essayMaterial.maxWordCount)
              formData.append(
                `materials[${blockIndex}][essay_item][max_word_count]`,
                essayMaterial.maxWordCount.toString(),
              );
            break;

          case "identificationItem":
            const identificationMaterial =
              block.material as IdentificationItemBlock;

            if (identificationMaterial.acceptedAnswers.length !== 0) {
              formData.append(
                `materials[${blockIndex}][identification_item][accepted_answers]`,
                JSON.stringify(identificationMaterial.acceptedAnswers),
              );
            }
            formData.append(
              `materials[${blockIndex}][identification_item][is_case_sensitive]`,
              identificationMaterial.isCaseSensitive.toString(),
            );
            break;

          case "optionBasedItem":
            const optionBasedItem = block.material as OptionBasedItemBlock;

            formData.append(
              `materials[${blockIndex}][option_based_item][is_options_alphabetical]`,
              optionBasedItem.isAlphabeticalOrder.toString(),
            );
            if (optionBasedItem.options.length !== 0) {
              optionBasedItem.options.forEach((option, index) => {
                if (option.id)
                  formData.append(
                    `materials[${blockIndex}][option_based_item][options][${index}][id]`,
                    option.id,
                  );

                formData.append(
                  `materials[${blockIndex}][option_based_item][options][${index}][order]`,
                  (index + 1).toString(),
                );

                formData.append(
                  `materials[${blockIndex}][option_based_item][options][${index}][is_correct]`,
                  option.isCorrect.toString(),
                );

                if (option.optionText) {
                  formData.append(
                    `materials[${blockIndex}][option_based_item][options][${index}][option_text]`,
                    option.optionText,
                  );
                }

                if (option.optionFile) {
                  if (option.optionFile instanceof File) {
                    formData.append(
                      `materials[${blockIndex}][option_based_item][options][${index}][new_option_file]`,
                      option.optionFile,
                    );
                  } else {
                    formData.append(
                      `materials[${blockIndex}][option_based_item][options][${index}][kept_option_file]`,
                      JSON.stringify(option.optionFile),
                    );
                  }
                }
              });
            }
        }
      });

      await processBulkAssessmentMaterials(formData);
    } catch (error) {
      toast.error("An error occured. Please try again later.");
    }
  }

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
            onClick={async () => {
              const noChanges = isEqual(
                useManageAssessmentMaterialsStore.getState().blocks,
                useManageAssessmentMaterialsStore.getState().originalBlocks,
              );
              if (noChanges) {
                navigate({
                  to: "/lms/classes/$classId/contents/$chapterContentId",
                  params: {
                    chapterContentId: chapterContentInfo.id,
                    classId,
                  },
                });
                return;
              }

              toggleOpenDialog(
                <ConfirmationDialog
                  onClickYes={() => onSaveChanges()}
                  confirmationMessage="Are you sure you want to save changes?"
                />,
              );
            }}
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
