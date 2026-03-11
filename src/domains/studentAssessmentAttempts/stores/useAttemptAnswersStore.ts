import { create } from "zustand";

export type Answer = {
  assessmentMaterialId: string;
  materialType: "option_based_item" | "essay_item" | "identification_item";
  content: string | null;
};

export type UnansweredItem = Omit<Answer, "content"> & {
  itemNumber: number;
};

type Values = {
  answers: Answer[];
  isAnswersHydrated: boolean;
  unansweredItems: UnansweredItem[];
};

type Actions = {
  setAnswers: (answers: Answer[]) => void;
  setAnswer: (assessmentMaterialId: string, answerPayload: Answer) => void;
  setUnansweredItems: (unansweredItems: UnansweredItem[]) => void;
  resetState: () => void;
};

type Store = Values & Actions;

const defaultValues: Values = {
  answers: [],
  isAnswersHydrated: false,
  unansweredItems: [],
};

export const useAttemptAnswersStore = create<Store>((set) => ({
  ...defaultValues,
  setAnswers: (answers) => set({ answers, isAnswersHydrated: true }),
  setAnswer: (assessmentMaterialId, answerPayload) =>
    set((state) => {
      const foundAnswer = state.answers.find(
        (answer) => answer.assessmentMaterialId === assessmentMaterialId,
      );

      if (foundAnswer) {
        return {
          answers: state.answers.map((answer) => {
            if (answer.assessmentMaterialId === assessmentMaterialId) {
              return answerPayload;
            }
            return answer;
          }),
        };
      }

      return {
        answers: [...state.answers, answerPayload],
      };
    }),
  setUnansweredItems: (unansweredItems) => set({ unansweredItems }),
  resetState: () => set(defaultValues),
}));
