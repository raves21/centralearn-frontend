import { create } from "zustand";

export type Answer = {
  assessmentMaterialId: string;
  materialType: "option_based_item" | "essay_item" | "identification_item";
  content: string | null;
};

type Values = {
  answers: Answer[];
  isAnswersHydrated: boolean;
};

type Actions = {
  setAnswers: (answers: Answer[]) => void;
  setAnswer: (assessmentMaterialId: string, answerPayload: Answer) => void;
};

type Store = Values & Actions;

const defaultValues: Values = {
  answers: [],
  isAnswersHydrated: false,
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
}));
