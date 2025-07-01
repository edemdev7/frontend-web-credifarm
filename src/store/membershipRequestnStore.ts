import { create } from "zustand";
import {
  IMembershipRequest,
  getMembershipRequests,
} from "../api/services/cooperative/membershipRequestService";

interface MembershipRequestStore {
  membershipRequests: IMembershipRequest[];
  selectedMembershipRequest: IMembershipRequest | null;
  setMembershipRequests: (membershipRequests: IMembershipRequest[]) => void;
  setSelectedMembershipRequest: (selectedMembershipRequest: IMembershipRequest | null) => void;
  clearMembershipRequests: () => void;
  clearSelectedMembershipRequest: () => void;
  fetchMembershipRequests: () => Promise<void>;
}

export const useMembershipRequestStore = create<MembershipRequestStore>((set) => ({
  membershipRequests: [],
  selectedMembershipRequest: null,

  setMembershipRequests: (membershipRequests) => {
    set({ membershipRequests });
  },

  setSelectedMembershipRequest: (selectedMembershipRequest) => {
    set({ selectedMembershipRequest });
  },

  clearMembershipRequests: () => {
    set({ membershipRequests: [] });
  },

  clearSelectedMembershipRequest: () => {
    set({ selectedMembershipRequest: null });
  },

  fetchMembershipRequests: async () => {
    try {
      set({ membershipRequests: [] });
      // Récupérer la liste des membershipRequests
      const response = await getMembershipRequests();
      set({ membershipRequests: response as unknown as IMembershipRequest[] });
    } catch (error) {
      console.log(error);
    }
  },
}));
