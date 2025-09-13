import type { ReactNode } from "react";
import { create } from "zustand";

type Values = {
  isDialogOpen: boolean;
  dialogContent: ReactNode;
};

type Actions = {
  toggleOpenDialog: (dialogContent: ReactNode | null) => void;
};

type Store = Values & Actions;

const defaultValues: Values = {
  isDialogOpen: false,
  dialogContent: null,
};

export const useGlobalStore = create<Store>((set) => ({
  ...defaultValues,
  toggleOpenDialog: (dialogContent: ReactNode | null) => {
    if (dialogContent) {
      set({
        dialogContent,
        isDialogOpen: true,
      });
    } else {
      set({ isDialogOpen: false });
      setTimeout(() => {
        set({ dialogContent: null });
      }, 150);
    }
  },
}));
