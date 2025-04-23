import { UserInfo } from '../modules/profile/store';

const DEFAULT_AVATAR = 'default-avatar.png';

export const mergeUserInfo = (
  remote: UserInfo,
  local: UserInfo | null
): UserInfo => {
  const isDefaultAvatar = remote.avatar_path === DEFAULT_AVATAR;

  return {
    ...remote,
    avatar_path: isDefaultAvatar ? local?.avatar_path || null : remote.avatar_path,
    background: local?.background || remote.background || null,
    nickname: remote.nickname || local?.nickname || '',
  };
};
