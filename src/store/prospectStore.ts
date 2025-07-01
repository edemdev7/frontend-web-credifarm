import { create } from "zustand";

export interface Prospect {
  id: number;
  masterStatus?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  status?: string;
  recommendationType?: string;
  presentationMade?: boolean;
  encounteredIssue?: string | null;
  followUpDate1?: string | null;
  followUpDate2?: string | null;
  preferredName?: string;
  isConvinced?: boolean;
  waitingReason?: string | null;
  blockingReason?: string | null;
  stageStatus?: string;
  createStep0?: string | null;
  updateStep0?: string | null;
  commentStep0?: string | null;
  createStep1?: string | null;
  updateStep1?: string | null;
  commentStep1?: string | null;
  createStep2?: string | null;
  updateStep2?: string | null;
  commentStep2?: string | null;
  createStep3?: string | null;
  updateStep3?: string | null;
  commentStep3?: string | null;
  createStep4?: string | null;
  updateStep4?: string | null;
  commentStep4?: string | null;
  createStep5?: string | null;
  updateStep5?: string | null;
  commentStep5?: string | null;
  createdAt?: string;
  updatedAt?: string;
  business?: {
    id: number;
    businessType?: string;
    vertical?: string;
    role?: string;
    segment?: string;
    supplyFrequencyPerMonth?: number;
    averageAmount?: number;
    businessForm?: string;
    paymentMethod?: string;
    supplierRelationshipDurationMonths?: number;
    prospectId?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  client?: {
    id: number;
    fineractId?: number;
    accountNo?: string;
    externalId?: string;
    e164?: string;
    name?: string;
    firstName?: string;
    fullname?: string | null;
    displayName?: string;
    isActive?: boolean;
    isPhoneNumberVerified?: boolean;
    hasAlreadylogin?: boolean;
    password?: string;
    district?: string | null;
    refreshToken?: string | null;
    firebaseToken?: string;
    contactMethod?: string | null;
    paymentMethod?: string | null;
    paymentNumber?: string | null;
    applicationUp?: boolean;
    role?: string;
    cguIsAccept?: boolean;
    birthDay?: string | null;
    masterStatus?: string;
    stageStatus?: string;
    prospectId?: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface ProspectStore {
  prospects: Prospect[];
  selectedProspect: Prospect | null;
  setSelectedProspect: (prospect: Prospect | null) => void;
  clearSelectedProspect: () => void;
  addProspect: (prospect: Prospect) => void;
  updateProspect: (id: number, updatedProspect: Prospect) => void;
  setProspects: (prospects: Prospect[]) => void; // Ajout de setProspects
}

export const useProspectStore = create<ProspectStore>((set) => ({
  prospects: [],
  selectedProspect: null,

  setSelectedProspect: (prospect) => {
    set({ selectedProspect: prospect });
  },

  clearSelectedProspect: () => {
    set({ selectedProspect: null });
  },

  addProspect: (prospect) => {
    set((state) => ({ prospects: [...state.prospects, prospect] }));
  },

  updateProspect: (id, updatedProspect) => {
    set((state) => ({
      prospects: state.prospects.map((prospect) =>
        prospect.id === id ? { ...prospect, ...updatedProspect } : prospect
      ),
    }));
  },

  setProspects: (prospects) => {
    // Implémentation de setProspects
    set({ prospects });
  },
}));
