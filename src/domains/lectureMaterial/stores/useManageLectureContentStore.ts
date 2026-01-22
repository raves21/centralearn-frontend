import { create } from "zustand";

type FileBlock = {
  type: "file";
  content: File | string; // File for new uploads, string URL for existing files
};

import type { BulkChangesPayload, SyncMaterialItem } from "../types";

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
  computeChanges: (lectureId: string) => BulkChangesPayload;
};

type Store = Values & Actions;

const initialState: Values = {
  blocks: [],
  originalBlocks: [],
};

export const useManageLectureContentStore = create<Store>((set) => ({
  ...initialState,
  addBlock: (args) =>
    set((state) => {
      const id = crypto.randomUUID();
      let newBlock: ContentBlock;

      if (args.type === "text") {
        newBlock = {
          id,
          type: "text",
          content: "<p></p>",
        };
      } else {
        newBlock = {
          id,
          type: "file",
          content: args.file,
        };
      }

      return {
        blocks: [...state.blocks, newBlock],
      };
    }),
  addBlockAfter: (blockId, args) =>
    set((state) => {
      const id = crypto.randomUUID();
      let newBlock: ContentBlock;

      if (args.type === "text") {
        newBlock = {
          id,
          type: "text",
          content: "<p></p>",
        };
      } else {
        newBlock = {
          id,
          type: "file",
          content: args.file,
        };
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

        if (
          block.type === "file" &&
          (content instanceof File || typeof content === "string")
        ) {
          return { ...block, content, isModified: true };
        } else if (block.type === "text" && typeof content === "string") {
          return { ...block, content, isModified: true };
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
  computeChanges: (lectureId) => {
    const state = useManageLectureContentStore.getState();
    const { blocks } = state;

    const materials: SyncMaterialItem[] = [];

    blocks.forEach((block, index) => {
      const order = index + 1; // 1-indexed order

      const item: SyncMaterialItem = {
        id: block.dbId ?? null,
        material_type: block.type,
        order,
      };

      if (block.type === "text") {
        item.material_content = block.content as string;
      } else if (block.type === "file") {
        // Only include file if it's a new File object
        if (block.content instanceof File) {
          item.material_file = block.content;
        }
      }

      materials.push(item);
    });

    return {
      lecture_id: lectureId,
      materials,
    };
  },
}));
