import { create } from 'zustand';
import { Post } from '../../../types/post'; // ✅ 按你的项目结构调整路径

interface PostCardStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
}

export const usePostCardStore = create<PostCardStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));
