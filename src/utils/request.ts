import { useAuthStore } from '../modules/auth/store';
import { handleTokenExpiredOnce } from './handleTokenExpiredOnce';

const API_BASE_URL = 'https://remote.xiaoen.xyz';

/**
 * 通用请求封装
 */
export const request = async (
  path: string,
  options: RequestInit = {},
  withAuth = true
): Promise<any> => {
  try {
    const token = useAuthStore.getState().token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    if (withAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    // ⚠️ 后端可能返回 204 No‑Content，要兼容空 body
    const text = await response.text().catch(() => '');
    const json = text ? JSON.parse(text) : { code: response.status, data: null };

    // 统一拦截 token 失效
    if (json.code === 40003 || json.code === 401 || response.status === 401) {
      handleTokenExpiredOnce();
    }

    return json;
  } catch (err) {
    console.error('请求出错:', err);
    return {
      code: -1,
      msg: '网络异常',
      data: null,
    };
  }
};

/**
 * POST 简写
 */
export const post = <T = any>(
  path: string,
  body: Record<string, unknown>,
  withAuth = true
) =>
  request(
    path,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    withAuth
  ) as Promise<T>;

/**
 * GET 简写
 */
export const get = <T = any>(path: string, withAuth = true) =>
  request(
    path,
    {
      method: 'GET',
    },
    withAuth
  ) as Promise<T>;
