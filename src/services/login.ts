import { request } from 'umi';

/**
 * 退出登录
 */
export async function outLogin() {
  return request('/v1/auth/logout', {
    method: 'POST',
  });
}

/**
 * 登录
 * @param body
 * @param options
 * @returns
 */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/v1/auth/login/', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
