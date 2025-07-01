import { create } from "zustand";

interface TriggerState {
  triggered: boolean;
  setTriggered: (value: boolean) => void;
  toggleTriggered: () => void;
}

const useTriggerStore = create<TriggerState>((set) => ({
  triggered: false,
  setTriggered: (value) => set({ triggered: value }),
  toggleTriggered: () => {
    return set((state) => ({ triggered: !state.triggered }));
  },
}));

export default useTriggerStore;
