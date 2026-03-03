import { create } from "zustand";

export type Answer = {
  materialId: string;
  materialType:
    | "App\\Models\\OptionBasedItem"
    | "App\\Models\\EssayItem"
    | "App\\Models\\IdentificationItem";
  content: string | null;
};

type Values = {
  answers: Answer[];
};

type Actions = {
  setAnswers: (answers: Answer[]) => void;
  setAnswerContent: (materialId: string, content: string | null) => void;
};

type Store = Values & Actions;

const defaultValues: Values = {
  answers: [],
};

export const useAttemptAnswersStore = create<Store>((set) => ({
  ...defaultValues,
  setAnswers: (answers) => set({ answers }),
  setAnswerContent: (materialId, content) =>
    set((state) => ({
      answers: state.answers.map((answer) => {
        if (answer.materialId === materialId) {
          return {
            ...answer,
            content,
          };
        }
        return answer;
      }),
    })),
}));
