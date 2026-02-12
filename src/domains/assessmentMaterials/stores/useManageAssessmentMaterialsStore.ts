import type { FileAttachment } from "@/utils/sharedTypes";
import { create } from "zustand";

export type MaterialQuestion = {
  id?: string;
  questionText: string;
  questionFiles: (File | FileAttachment)[];
};

export type OptionBasedItemOptionBlock = {
  id?: string;
  isCorrect: boolean;
  optionText: string | null;
  optionFile: File | FileAttachment | null;
};

export type OptionBasedItemBlock = {
  options: OptionBasedItemOptionBlock[];
  isOptionsAlphabetical: boolean;
};

export type EssayItemBlock = {
  maxCharacterCount: number | null;
  minCharacterCount: number | null;
  maxWordCount: number | null;
  minWordCount: number | null;
};

export type IdentificationItemBlock = {
  acceptedAnswers: string[];
  isCaseSensitive: boolean;
};

export type ContentBlock = {
  id: string; // Client-side UUID
  dbId?: string; // Database ID (only for existing materials)
  materialQuestion: MaterialQuestion;
  pointWorth: number;
  materialType: "optionBasedItem" | "essayItem" | "identificationItem";
  material: OptionBasedItemBlock | EssayItemBlock | IdentificationItemBlock;
};

type Values = {
  blocks: ContentBlock[];
  originalBlocks: ContentBlock[];
};

type Actions = {
  addBlock: (
    type: "optionBasedItem" | "essayItem" | "identificationItem",
  ) => void;
  addBlockAfter: (
    blockId: string,
    type: "optionBasedItem" | "essayItem" | "identificationItem",
  ) => void;
  updateBlock: (blockId: string, blockUpdateData: ContentBlock) => void;
  removeBlock: (id: string) => void;
  setBlocks: (blocks: ContentBlock[]) => void;
  updateBlocks: (blocks: ContentBlock[]) => void;
};

type Store = Values & Actions;

const initialState: Values = {
  blocks: [],
  originalBlocks: [],
};

const getEmptyIdentificationItemBlock = (): ContentBlock => ({
  id: `new-${crypto.randomUUID()}`,
  materialQuestion: {
    questionFiles: [],
    questionText: "<p></p>",
  },
  pointWorth: 1,
  materialType: "identificationItem",
  material: {
    acceptedAnswers: [""],
    isCaseSensitive: false,
  } as IdentificationItemBlock,
});

const getEmptyEssayItemBlock = (): ContentBlock => ({
  id: `new-${crypto.randomUUID()}`,
  materialQuestion: {
    questionFiles: [],
    questionText: "<p></p>",
  },
  pointWorth: 1,
  materialType: "essayItem",
  material: {
    maxCharacterCount: null,
    minCharacterCount: null,
    maxWordCount: null,
    minWordCount: null,
  } as EssayItemBlock,
});

const getEmptyOptionBasedItemBlock = (): ContentBlock => ({
  id: `new-${crypto.randomUUID()}`,
  materialQuestion: {
    questionFiles: [],
    questionText: "<p></p>",
  },
  pointWorth: 1,
  materialType: "optionBasedItem",
  material: {
    options: [],
    isOptionsAlphabetical: true,
  } as OptionBasedItemBlock,
});

export const useManageAssessmentMaterialsStore = create<Store>((set) => ({
  ...initialState,
  addBlock: (type) =>
    set((state) => {
      let newBlock: ContentBlock;

      switch (type) {
        case "optionBasedItem":
          newBlock = getEmptyOptionBasedItemBlock();
          break;
        case "essayItem":
          newBlock = getEmptyEssayItemBlock();
          break;
        case "identificationItem":
          newBlock = getEmptyIdentificationItemBlock();
          break;
      }
      return {
        blocks: [...state.blocks, newBlock],
      };
    }),
  addBlockAfter: (blockId, type) =>
    set((state) => {
      let newBlock: ContentBlock;

      switch (type) {
        case "optionBasedItem":
          newBlock = getEmptyOptionBasedItemBlock();
          break;
        case "essayItem":
          newBlock = getEmptyEssayItemBlock();
          break;
        case "identificationItem":
          newBlock = getEmptyIdentificationItemBlock();
          break;
      }
      const blockIndex = state.blocks.findIndex(
        (block) => block.id === blockId,
      );

      if (blockIndex === -1) {
        // If block not found, add to the end
        return {
          blocks: [...state.blocks, newBlock],
        };
      }

      const newBlocks = [...state.blocks];
      newBlocks.splice(blockIndex + 1, 0, newBlock);

      return {
        blocks: newBlocks,
      };
    }),
  updateBlock: (blockId, blockUpdateData) =>
    set((state) => ({
      blocks: state.blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            ...blockUpdateData,
          };
        }
        return block;
      }),
    })),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
  updateBlocks: (blocks) => set({ blocks }), // Only update blocks, keep originalBlocks intact
  setBlocks: (blocks) =>
    set({ blocks, originalBlocks: JSON.parse(JSON.stringify(blocks)) }),
}));
