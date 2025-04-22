import { create } from 'zustand';

type AuthStore = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  login: () => {
    console.log('登录成功');
    set({ isLoggedIn: true });
  },
  logout: () => {
    console.log('退出登录');
    set({ isLoggedIn: false });
  },
}));
