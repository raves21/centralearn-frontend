import { useState } from "react";

type Args = {
  formSteps: Record<number, any>;
  form: any;
};

export function useMultiStepFormState({ formSteps, form }: Args) {
  const [currentStep, setCurrentStep] = useState(1);
  async function nextStep() {
    const currentStepFields = formSteps[currentStep];
    const isValid = await form.trigger(currentStepFields.step);
    if (isValid) setCurrentStep((prev) => prev + 1);
  }

  function prevStep() {
    setCurrentStep((prev) => prev - 1);
  }

  return { currentStep, setCurrentStep, nextStep, prevStep };
}
