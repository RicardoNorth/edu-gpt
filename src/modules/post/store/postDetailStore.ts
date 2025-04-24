import { create } from 'zustand';
import { Post } from '../../../types/post';

interface PostDetailState {
  currentPost: Post | null;
  setCurrentPost: (post: Post) => void;
  clearPost: () => void;
}

export const usePostDetailStore = create<PostDetailState>((set) => ({
  currentPost: null,
  setCurrentPost: (post) => set({ currentPost: post }),
  clearPost: () => set({ currentPost: null }),
}));
