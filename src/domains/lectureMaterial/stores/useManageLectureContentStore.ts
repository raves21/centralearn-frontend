import { create } from "zustand";

type FileBlock = {
  type: "file";
  content: File | string; // File for new uploads, string URL for existing files
};

type TextBlock = {
  type: "text";
  content: string;
};

export type ContentBlock = {
  id: string; // Client-side UUID
  dbId?: string; // Database ID (only for existing materials)
} & (FileBlock | TextBlock);

type AddFileBlockArgs = {
  type: "file";
  file: File;
};

type AddTextBlockArgs = {
  type: "text";
};

type Values = {
  blocks: ContentBlock[];
  originalBlocks: ContentBlock[]; // Snapshot of initial state from DB
};

type Actions = {
  addBlock: (args: AddFileBlockArgs | AddTextBlockArgs) => void;
  addBlockAfter: (
    blockId: string,
    args: AddFileBlockArgs | AddTextBlockArgs,
  ) => void;
  updateBlock: (id: string, content: string | File) => void;
  removeBlock: (id: string) => void;
  setBlocks: (blocks: ContentBlock[]) => void;
  updateBlocks: (blocks: ContentBlock[]) => void; // Update blocks without resetting originalBlocks
};

type Store = Values & Actions;

const initialState: Values = {
  blocks: [],
  originalBlocks: [],
};

const getEmptyTextBlock = (): ContentBlock => ({
  id: crypto.randomUUID(),
  type: "text",
  content: "<p></p>",
});

const getEmptyFileBlock = (file: File): ContentBlock => ({
  id: crypto.randomUUID(),
  type: "file",
  content: file,
});

export const useManageLectureContentStore = create<Store>((set) => ({
  ...initialState,
  addBlock: (args) =>
    set((state) => {
      let newBlock: ContentBlock;

      if (args.type === "text") {
        newBlock = getEmptyTextBlock();
      } else {
        newBlock = getEmptyFileBlock(args.file);
      }

      return {
        blocks: [...state.blocks, newBlock],
      };
    }),
  addBlockAfter: (blockId, args) =>
    set((state) => {
      let newBlock: ContentBlock;

      if (args.type === "text") {
        newBlock = getEmptyTextBlock();
      } else {
        newBlock = getEmptyFileBlock(args.file);
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
  updateBlock: (id, content) =>
    set((state) => ({
      blocks: state.blocks.map((block) => {
        if (block.id !== id) return block;

        if (block.type === "file") {
          return { ...block, content: content as File };
        } else if (block.type === "text") {
          return { ...block, content: content as string };
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
