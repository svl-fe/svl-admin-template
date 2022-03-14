import React, { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { message } from 'antd';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import MyIcon from '@/components/Icon';
import { createCaptcha } from '@/utils/captcha';
import { login } from '@/services/login';
import loginPng from '@/asserts/login.png';
import logoAvatar from '@/asserts/logo.png';

import styles from './index.less';

const Login: React.FC = () => {
  const [captcha, setCaptcha] = useState('');
  const { setInitialState } = useModel('@@initialState');

  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  const changeCaptcha = () => {
    setCaptcha(createCaptcha());
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const response = await login({ ...values, app: 'qzh' });

      message.success('登录成功');
      if (response) {
        const { query } = history.location;
        const { redirect } = query as { redirect: string };

        if (!history) return;
        await setInitialState((s) => {
          return { ...s, login: response };
        });

        history.push(redirect || '/');
        localStorage.setItem('login', JSON.stringify(response));
      }
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img className={styles.logoAvatar} src={logoAvatar} alt="薮猫科技" />
        <img className={styles.loginImg} src={loginPng} alt="让数据更安全" />
      </div>

      <div className={styles.content}>
        <LoginForm
          title="后台模板系统管理端"
          initialValues={{ autoLogin: true }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            name="username"
            placeholder="用户名"
            fieldProps={{
              size: 'large',
              prefix: (
                <MyIcon
                  type="icon-dengluye-yonghu"
                  style={{ fontSize: '20px', color: '#C8C9CC' }}
                />
              ),
            }}
            rules={[{ required: true, message: '请输入用户名!' }]}
          />

          <ProFormText.Password
            name="password"
            placeholder="密码"
            fieldProps={{
              size: 'large',
              prefix: <MyIcon type="icon-dengluye-mima" style={{ fontSize: '20px' }} />,
            }}
            rules={[
              { required: true, message: '请输入密码！' },
              // { min: 8, message: '密码长度至少为8位' },
            ]}
          />

          <ProFormText
            name="captcha"
            placeholder="请输入验证码"
            fieldProps={{
              size: 'large',
              prefix: <MyIcon type="icon-dengluye-xiaoyan" style={{ fontSize: '20px' }} />,
              suffix: (
                <canvas
                  id="canvas"
                  width="55px"
                  height="27px"
                  style={{ cursor: 'pointer' }}
                  onClick={changeCaptcha}
                />
              ),
            }}
            validateTrigger={'onSubmit'}
            rules={[
              { required: true, message: '请输入验证码!' },
              () => ({
                validator(_, value) {
                  if (value === captcha) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('验证码错误'));
                },
              }),
            ]}
          />
          {/* <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              记住密码
            </ProFormCheckbox>
          </div> */}
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
