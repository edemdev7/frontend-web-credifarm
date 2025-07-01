import { create } from "zustand";
import { IBusiness } from "../api/services/businessService";
import {
  Step1FormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
  Step5FormData,
  Step7FormData,
} from "../components/types/form";
import { Step } from "../components/types/step";

type StepFormData =
  | Step1FormData
  | Step2FormData
  | Step3FormData
  | Step4FormData
  | Step5FormData
  | Step7FormData;

type StepKey = "step1" | "step2" | "step3" | "step4" | "step5";

interface StepProps {
  steps: Step[];
  currentStep: number;
  prospectID: number;
  businessID: number;
  clientID: number;
  setProspectID: (prospectID: number) => void;
  setBusinessID: (businessID: number) => void;
  setClientID: (clientID: number) => void;
  onNext: () => void;
  isLastStep: () => boolean;
  setCurrentStep: (step: number) => void;
  markStepAsCompleted: (step: number) => void;
  business: IBusiness | null;
  setBusiness: (business: IBusiness) => void;
  formData: {
    step1?: Step1FormData;
    step2?: Step2FormData;
    step3?: Step3FormData;
    step4?: Step4FormData;
    step5?: Step5FormData;
    step7?: Step7FormData;
  };
  setFormData: (step: number, data: StepFormData) => void;
  resetStore: () => void; // Ajout de la méthode pour réinitialiser
  resetFormData: () => void; // Ajout de la méthode pour réinitialiser les données du formulaire
}

const useRetailersStepStore = create<StepProps>((set, get) => ({
  currentStep: 1,
  prospectID: 0,
  businessID: 0,
  clientID: 0,
  steps: [
    { id: 1, label: "Leads", completed: false },
    { id: 2, label: "1er Contact", completed: false },
    { id: 3, label: "Négociation", completed: false },
    { id: 4, label: "Vérification Danaya", completed: false },
    { id: 5, label: "Contact KYC", completed: false },
    { id: 6, label: "Évaluation", completed: false },
    { id: 7, label: "Onboardé", completed: false },
  ],
  business: null,
  setBusiness: (business) => set({ business }),
  setProspectID: (prospectID) => set({ prospectID }),
  setBusinessID: (businessID) => set({ businessID }),
  setClientID: (clientID) => set({ clientID }),
  formData: {},
  onNext: () => {
    const { currentStep, steps, formData } = get();
    if (currentStep < steps.length) {
      const stepKey = `step${currentStep}` as StepKey;
      const currentStepData = formData[stepKey];
      if (currentStepData || currentStep === 6) {
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
      { id: 1, label: "Leads", completed: false },
      { id: 2, label: "1er Contact", completed: false },
      { id: 3, label: "Négociation", completed: false },
      { id: 4, label: "Vérification Danaya", completed: false },
      { id: 5, label: "Contact KYC", completed: false },
      { id: 6, label: "Évaluation", completed: false },
      { id: 7, label: "Onboardé", completed: false },
    ];
    set({
      currentStep: 1,
      steps: initialSteps,
      business: null,
      formData: {},
      prospectID: 0,
      businessID: 0,
      clientID: 0, // Réinitialiser clientID
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

export default useRetailersStepStore;
