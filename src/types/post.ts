export interface Post {
  id: string;
  nickname: string;
  avatar: any;
  title: string;
  content: string;
  preview: string;
  image?: string[];
  likes: number;
  saves: number;
}