import { create } from "zustand";

type MaterialQuestion = {
  id?: string;
  questionText: string;
  questionFiles: (File | string)[];
};

type OptionBasedItemOption = {
  id?: string;
  isCorrect: boolean;
  optionText: string | null;
  optionFile: File | string | null;
};

type OptionBasedItemBlock = {
  options: OptionBasedItemOption[];
};

type EssayItemBlock = {
  maxCharacterCount: number | null;
  minCharacterCount: number | null;
  maxWordCount: number | null;
  minWordCount: number | null;
};

type IdentificationItemBlock = {
  acceptedAnswers: string[];
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

const addEmptyIdentificationItemBlock = (): ContentBlock => ({
  id: crypto.randomUUID(),
  materialQuestion: {
    questionFiles: [],
    questionText: "<p></p>",
  },
  pointWorth: 1,
  materialType: "identificationItem",
  material: {
    acceptedAnswers: [],
  } as IdentificationItemBlock,
});

const addEmptyEssayItemBlock = (): ContentBlock => ({
  id: crypto.randomUUID(),
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

const addEmptyOptionBasedItemBlock = (): ContentBlock => ({
  id: crypto.randomUUID(),
  materialQuestion: {
    questionFiles: [],
    questionText: "<p></p>",
  },
  pointWorth: 1,
  materialType: "optionBasedItem",
  material: {
    options: [],
  } as OptionBasedItemBlock,
});

export const useManageAssessmentMaterialsStore = create<Store>((set) => ({
  ...initialState,
  addBlock: (type) =>
    set((state) => {
      let newBlock: ContentBlock;

      switch (type) {
        case "optionBasedItem":
          newBlock = addEmptyOptionBasedItemBlock();
          break;
        case "essayItem":
          newBlock = addEmptyEssayItemBlock();
          break;
        case "identificationItem":
          newBlock = addEmptyIdentificationItemBlock();
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
          newBlock = addEmptyOptionBasedItemBlock();
          break;
        case "essayItem":
          newBlock = addEmptyEssayItemBlock();
          break;
        case "identificationItem":
          newBlock = addEmptyIdentificationItemBlock();
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
