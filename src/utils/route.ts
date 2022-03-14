/**
 * 处理路由相关的方法
 */
import { history } from 'umi';

export const isMatchRoute = (path: string | undefined) => {
  if (!path) return false;

  return history.location.pathname.includes(path);
};
