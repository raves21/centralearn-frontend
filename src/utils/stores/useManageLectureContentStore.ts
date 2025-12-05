import { create } from 'zustand';

type FileContentBlock = {
  type: 'file';
  content: File;
}

type TextContentBlock = {
  type: 'text';
  content: string;
}

type ContentBlock = {
  id: string
} & (FileContentBlock | TextContentBlock);

type AddFileBlockArgs = {
  type: 'file'
  file: File
}

type AddTextBlockArgs = {
  type: 'text'
}

type Values = {
  blocks: ContentBlock[];
}

type Actions = {
  addBlock: (args: AddFileBlockArgs | AddTextBlockArgs) => void;
  updateBlock: (id: string, content: string | File) => void;
  removeBlock: (id: string) => void;
  setBlocks: (blocks: ContentBlock[]) => void;
}

type ContentStore = Values & Actions

const initialState: Values = {
  blocks: [],
}

export const useManageLectureContentStore = create<ContentStore>((set) => ({
  ...initialState,
  addBlock: (args) =>
    set((state) => {
      const id = crypto.randomUUID();
      let newBlock: ContentBlock;
      
      if (args.type === 'text') {
        newBlock = {
          id,
          type: 'text',
          content: '<p></p>',
        };
      } else {
        newBlock = {
          id,
          type: 'file',
          content: args.file,
        };
      }
      
      return {
        blocks: [...state.blocks, newBlock],
      };
    }),
  updateBlock: (id, content) =>
    set((state) => ({
      blocks: state.blocks.map((block) => {
        if (block.id !== id) return block;
        
        if (block.type === 'file' && content instanceof File) {
          return { ...block, content };
        } else if (block.type === 'text' && typeof content === 'string') {
          return { ...block, content };
        }
        return block;
      }),
    })),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
  setBlocks: (blocks) => set({ blocks }),
}));
