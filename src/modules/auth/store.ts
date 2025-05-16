import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfo {
  id: number;
  nickname: string;
  avatar_url: string; 
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: UserInfo | null;
  login: () => void;
  logout: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setUser: (user: UserInfo | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      user: null,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false, token: null }),
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
