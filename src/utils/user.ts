import { UserInfo } from '../modules/profile/store';

export const mergeUserInfo = (
  remote: UserInfo,
  local: UserInfo | null
): UserInfo => {
  return {
    ...remote,
    // 以服务器为主，若服务器为 null/空，保留本地字段
    avatar_path: remote.avatar_path || local?.avatar_path || null,
    background: local?.background || remote.background || null,
    nickname: remote.nickname || local?.nickname || '', // 昵称也可选保留
  };
};
