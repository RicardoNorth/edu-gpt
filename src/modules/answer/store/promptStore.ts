import { create } from 'zustand';

interface PromptStore {
  aiName: string;
  setAiName: (name: string) => void;
  aiAvatar: string;
  setAiAvatar: (url: string) => void;
  prompt: string;
  setPrompt: (newPrompt: string) => void;
}

export const usePromptStore = create<PromptStore>((set) => ({
  aiName: '冰小糖', // 默认昵称
  setAiName: (name) => set({ aiName: name }),
  aiAvatar: '', // 默认没有头像
  setAiAvatar: (url) => set({ aiAvatar: url }),
  prompt: '你是一名合肥工业大学在读大学生...', // 默认人设
  setPrompt: (newPrompt) => set({ prompt: newPrompt }),
}));
