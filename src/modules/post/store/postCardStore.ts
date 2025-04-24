import { create } from 'zustand';

export interface Post {
  id: string;
  nickname: string;
  avatar: any;
  title: string;
  preview: string;
  likes: number;
  saves: number;
}

interface PostCardStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
}

export const usePostCardStore = create<PostCardStore>((set) => ({
  posts: [
    {
      id: '1',
      nickname: '阿少',
      avatar: require('../../../../assets/default-avatar.png'),
      title: '大神们是从哪获取优质信息，比如哪些公众号、知乎？',
      preview:
        '越后面越精华，慢慢翻。一个社会的进步，在于每个人能否接受和掌握这个社会积累和创造的知识...',
      likes: 50000,
      saves: 230000,
    },
    {
      id: '2',
      nickname: '平凡',
      avatar: require('../../../../assets/default-avatar.png'),
      title: '你博士期间发表了几篇 SCI？',
      preview: '论文这个东西，我算是总结出一些窍门了。英国的博士没有对论文的硬性规定...',
      likes: 1093,
      saves: 1780,
    },
    {
      id: '3',
      nickname: '张君',
      avatar: require('../../../../assets/default-avatar.png'),
      title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
      preview: '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
      likes: 6907,
      saves: 18000,
    },
    {
      id: '4',
      nickname: '张君',
      avatar: require('../../../../assets/default-avatar.png'),
      title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
      preview: '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
      likes: 6907,
      saves: 18000,
    },
    {
      id: '5',
      nickname: '张君',
      avatar: require('../../../../assets/default-avatar.png'),
      title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
      preview: '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
      likes: 6907,
      saves: 18000,
    },
    {
      id: '6',
      nickname: '张君',
      avatar: require('../../../../assets/default-avatar.png'),
      title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
      preview: '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
      likes: 6907,
      saves: 18000,
    },
  ],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));
