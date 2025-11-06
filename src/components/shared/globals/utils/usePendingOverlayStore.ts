import { create } from "zustand";

type Values = {
  isPending: boolean;
  pendingLabel?: string;
};

type Actions = {
  setIsPending: (isPending: boolean) => void;
  setPendingLabel: (pendingLabel?: string) => void;
};

type Store = Values & Actions;

const defaultValues: Values = {
  isPending: false,
  pendingLabel: "Loading",
};

export const usePendingOverlayStore = create<Store>((set) => ({
  ...defaultValues,
  setIsPending: (isPending: boolean) => set({ isPending }),
  setPendingLabel: (pendingLabel?: string) => set({ pendingLabel }),
}));
