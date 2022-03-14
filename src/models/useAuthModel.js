/**
 * 借助 @umijs/plugin-model 将普通定义的 hooks 状态变成全局状态，
 * 使原先 hooks 隔离的状态变成可以共享。
 */
import { useState, useCallback } from 'react';

export default function useAuthModel() {
  const [user, setUser] = useState(null);

  const signin = useCallback((account, password) => {
    console.log('登录系统');
  }, []);

  const signout = useCallback(() => {
    console.log('注销系统');
  }, []);

  return {
    user,
    signin,
    signout,
  };
}
