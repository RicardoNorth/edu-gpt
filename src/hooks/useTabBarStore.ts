import { create } from 'zustand';

interface TabBarState {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

export const useTabBarStore = create<TabBarState>((set) => ({
  visible: true,
  setVisible: (v) => set({ visible: v }),
}));
