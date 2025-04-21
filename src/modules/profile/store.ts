import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfo {
  user_id: number;
  nickname: string;
  avatar: string | null;
  background: string | null;
}

interface ProfileState {
  user: UserInfo;
  setAvatar: (uri: string) => void;
  updateNickname: (nickname: string) => void;
  setBackground: (uri: string) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      user: {
        user_id: 1,
        nickname: '小王',
        avatar: null,
        background: null,
      },
      setAvatar: (uri: string) =>
        set((state) => ({
          user: { ...state.user, avatar: uri },
        })),
      updateNickname: (nickname: string) =>
        set((state) => ({
          user: { ...state.user, nickname },
        })),
      setBackground: (uri: string) =>
        set((state) => ({
          user: { ...state.user, background: uri },
        })),
      resetProfile: () =>
        set(() => ({
          user: {
            user_id: 1,
            nickname: '小王',
            avatar: null,
            background: null,
          },
        })),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
