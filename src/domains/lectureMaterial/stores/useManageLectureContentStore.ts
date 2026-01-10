import { create } from "zustand";

type FileContentBlock = {
  type: "file";
  content: File | string; // File for new uploads, string URL for existing files
};

type TextContentBlock = {
  type: "text";
  content: string;
};

type ContentBlock = {
  id: string; // Client-side UUID
  dbId?: string; // Database ID (only for existing materials)
  isModified?: boolean; // Track if content changed
} & (FileContentBlock | TextContentBlock);

type AddFileBlockArgs = {
  type: "file";
  file: File | string; // Support both File and URL string
};

type AddTextBlockArgs = {
  type: "text";
};

type Values = {
  blocks: ContentBlock[];
  originalBlocks: ContentBlock[]; // Snapshot of initial state from DB
};

type NewMaterial = {
  lecture_id: string;
  material_type: "text" | "file";
  order: number;
  material_content?: string;
  material_file?: File;
};

type UpdatedMaterial = {
  id: string;
  material_type: "text" | "file";
  order: number;
  is_material_updated: boolean;
  material?: {
    content?: string;
    file?: File;
  };
};

type ComputedChanges = {
  new: NewMaterial[];
  updated: UpdatedMaterial[];
  deleted: string[];
};

type Actions = {
  addBlock: (args: AddFileBlockArgs | AddTextBlockArgs) => void;
  addBlockAfter: (
    blockId: string,
    args: AddFileBlockArgs | AddTextBlockArgs
  ) => void;
  updateBlock: (id: string, content: string | File) => void;
  removeBlock: (id: string) => void;
  setBlocks: (blocks: ContentBlock[]) => void;
  updateBlocks: (blocks: ContentBlock[]) => void; // Update blocks without resetting originalBlocks
  computeChanges: (lectureId: string) => ComputedChanges;
};

type ContentStore = Values & Actions;

const initialState: Values = {
  blocks: [],
  originalBlocks: [],
};

export const useManageLectureContentStore = create<ContentStore>((set) => ({
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
        (block) => block.id === blockId
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
    const { blocks, originalBlocks } = state;

    const newMaterials: NewMaterial[] = [];
    const updatedMaterials: UpdatedMaterial[] = [];
    const deletedMaterialIds: string[] = [];

    // Find new and updated materials
    blocks.forEach((block, index) => {
      const order = index + 1; // 1-indexed order

      if (!block.dbId) {
        // New material (no database ID)
        if (block.type === "text") {
          newMaterials.push({
            lecture_id: lectureId,
            material_type: "text",
            order,
            material_content: block.content,
          });
        } else {
          // File type
          if (block.content instanceof File) {
            newMaterials.push({
              lecture_id: lectureId,
              material_type: "file",
              order,
              material_file: block.content,
            });
          }
        }
      } else {
        // Existing material - check if updated
        const originalBlock = originalBlocks.find(
          (ob) => ob.dbId === block.dbId
        );

        if (originalBlock) {
          const originalIndex = originalBlocks.findIndex(
            (ob) => ob.dbId === block.dbId
          );
          const originalOrder = originalIndex + 1;
          const orderChanged = order !== originalOrder;

          // Check if content changed
          let contentChanged = false;
          if (block.type === "text" && originalBlock.type === "text") {
            contentChanged = block.content !== originalBlock.content;
          } else if (block.type === "file" && originalBlock.type === "file") {
            // If content is a File object, it means user uploaded a new file
            contentChanged = block.content instanceof File;
          }

          // If either order or content changed, add to updated
          if (orderChanged || contentChanged) {
            const updatedMaterial: UpdatedMaterial = {
              id: block.dbId,
              material_type: block.type,
              order,
              is_material_updated: contentChanged,
            };

            // Only include material field if content was actually updated
            if (contentChanged) {
              if (block.type === "text") {
                updatedMaterial.material = {
                  content: block.content,
                };
              } else if (
                block.type === "file" &&
                block.content instanceof File
              ) {
                updatedMaterial.material = {
                  file: block.content,
                };
              }
            }

            updatedMaterials.push(updatedMaterial);
          }
        }
      }
    });

    // Find deleted materials
    originalBlocks.forEach((originalBlock) => {
      if (originalBlock.dbId) {
        const stillExists = blocks.some(
          (block) => block.dbId === originalBlock.dbId
        );
        if (!stillExists) {
          deletedMaterialIds.push(originalBlock.dbId);
        }
      }
    });

    return {
      new: newMaterials,
      updated: updatedMaterials,
      deleted: deletedMaterialIds,
    };
  },
}));
