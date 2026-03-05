import { create } from "zustand";

export type Answer = {
  materialId: string;
  materialType: "option_based_item" | "essay_item" | "identification_item";
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
