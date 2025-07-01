import { create } from "zustand";

export interface Client {
  id: string;
  transactions?: {
    accountNo: string;
    status: string;
    createdAt: string;
    fee: string;
    overdueFee: string;
    inArrears: boolean;
    toPaid: number;
    principal: number;
    type: string;
    loanId: string;
    matureAt: string;
    paidAt: string;
  }[];
  accountBalance?: number;
  firstName?: string;
  fullname?: string;
  e164?: string;
  activation?: string;
  type?: string;
  name?: string;
  displayName?: string;
  birthDay?: string;
  paymentNumber?: string;
  paymentMethod?: string;
  contactMethod?: string;
  businessId?: number;
  masterStatus?: string;
}

interface ClientStore {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  clearSelectedClient: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  selectedClient: null,

  setSelectedClient: (client) => {
    set({ selectedClient: client });
  },

  clearSelectedClient: () => {
    set({ selectedClient: null });
  },
}));
