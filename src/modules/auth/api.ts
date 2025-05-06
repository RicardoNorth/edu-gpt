import { post } from '../../utils/request';

export const login = (username: string, password: string) => {
  return post('/api/v1/user/login', { username, password }, false);
};
