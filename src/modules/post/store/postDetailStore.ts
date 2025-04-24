import { create } from 'zustand';

export interface PostDetail {
  id: string;
  nickname: string;
  avatar: any;
  title: string;
  content: string;
  likes: number;
  saves: number;
}

interface PostDetailState {
  currentPost: PostDetail | null;
  setCurrentPost: (post: PostDetail) => void;
  clearPost: () => void;
}

export const usePostDetailStore = create<PostDetailState>((set) => ({
  currentPost: null,
  setCurrentPost: (post) => set({ currentPost: post }),
  clearPost: () => set({ currentPost: null }),
}));
