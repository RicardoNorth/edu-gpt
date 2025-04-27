import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserInfo {
  id: number;
  studentId: string;
  nickname: string;
  avatar_path: string | null;
  background?: string | null;
  department?: string;
  major?: string;
  class?: string;
  campus?: string;
  usernameZh?: string;
  sex?: string;
  self_eval_level?: number;
  system_score?: number;
  signature: string | null;
}

interface ProfileState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  updateNickname: (nickname: string) => void;
  setAvatar: (uri: string) => void;
  setBackground: (uri: string) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user: UserInfo) => set(() => ({ user })),

      updateNickname: (nickname: string) =>
        set((state) =>
          state.user ? { user: { ...state.user, nickname } } : state
        ),

      setAvatar: (uri: string) =>
        set((state) =>
          state.user ? { user: { ...state.user, avatar_path: uri } } : state
        ),

      setBackground: (uri: string) =>
        set((state) =>
          state.user ? { user: { ...state.user, background: uri } } : state
        ),

      resetProfile: () =>
        set(() => ({
          user: null,
        })),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
