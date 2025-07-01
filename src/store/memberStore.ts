import { create } from "zustand";
import { IMember } from "../components/types/member";
import { getMembers } from "../api/services/cooperative/memberService";

interface MemberStore {
  members: IMember[];
  selectedMember: IMember | null;
  setMembers: (members: IMember[]) => void;
  setSelectedMember: (selectedMember: IMember | null) => void;
  clearMembers: () => void;
  clearSelectedMember: () => void;
  fetchMembers: () => Promise<void>;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  selectedMember: null,
  setMembers: (members) => set({ members }),
  setSelectedMember: (selectedMember) => set({ selectedMember }),
  clearMembers: () => set({ members: [] }),
  clearSelectedMember: () => set({ selectedMember: null }),
  fetchMembers: async () => {
    try {
      const members = await getMembers();
      set({ members });
    } catch (error) {
      console.error("Error fetching members:", error);
      set({ members: [] });
    }
  },
}));
