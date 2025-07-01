import { create } from "zustand";
import { IBusiness } from "../api/services/businessService";
import {
  Step1FormDataS,
  Step2FormDataS,
  Step3FormDataS,
} from "../components/types/form";
import { Step } from "../components/types/step";

type StepFormData = Step1FormDataS | Step2FormDataS | Step3FormDataS;

type StepKey = "step1" | "step2" | "step3";

interface StepProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  isLastStep: () => boolean;
  setCurrentStep: (step: number) => void;
  markStepAsCompleted: (step: number) => void;
  business: IBusiness | null;
  setBusiness: (business: IBusiness) => void;
  formData: {
    step1?: Step1FormDataS;
    step2?: Step2FormDataS;
    step3?: Step3FormDataS;
  };
  setFormData: (step: number, data: StepFormData) => void;
  resetStore: () => void; // Ajout de la méthode pour réinitialiser
  resetFormData: () => void; // Ajout de la méthode pour réinitialiser les données du formulaire
}

const useSuppliersStepStore = create<StepProps>((set, get) => ({
  currentStep: 1,
  steps: [
    { id: 1, label: "Détails", completed: false },
    { id: 2, label: "Métier", completed: false },
    { id: 3, label: "Validation", completed: false },
  ],
  business: null,
  setBusiness: (business) => set({ business }),
  formData: {},
  onNext: () => {
    const { currentStep, steps, formData } = get();
    if (currentStep < steps.length) {
      const stepKey = `step${currentStep}` as StepKey;
      const currentStepData = formData[stepKey];
      if (currentStepData) {
        set((state) => ({
          currentStep: currentStep + 1,
          steps: state.steps.map((step) =>
            step.id === currentStep ? { ...step, completed: true } : step
          ),
        }));
      }
    }
  },
  isLastStep: () => {
    const { currentStep, steps } = get();
    return currentStep === steps.length;
  },
  setCurrentStep: (step: number) => {
    const { steps } = get();
    if (step > 0 && step <= steps.length) {
      set({ currentStep: step });
    }
  },
  setFormData: (step: number, data: StepFormData) => {
    const stepKey = `step${step}` as StepKey;
    set((state) => ({
      formData: {
        ...state.formData,
        [stepKey]: data,
      },
    }));
  },
  resetStore: () => {
    // Implémentation de la méthode pour réinitialiser
    const initialSteps = [
      { id: 1, label: "Détails", completed: false },
      { id: 2, label: "Métier", completed: false },
      { id: 2, label: "Validation", completed: false },
    ];
    set({
      currentStep: 1,
      steps: initialSteps,
      business: null,
      formData: {},
    });
  },
  resetFormData: () => {
    set({ formData: {} });
  },
  markStepAsCompleted: (stepId: number) => {
    const { steps } = get();
    set({
      steps: steps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      ),
    });
  },
}));

export default useSuppliersStepStore;
