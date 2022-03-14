import { message } from 'antd';
import { history } from 'umi';
import type { RequestConfig } from 'umi';
import type { RequestInterceptor, ResponseInterceptor } from 'umi-request';

const LOGIN_PATH = '/user/login';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const LOGIN_CODE = [2, 3, 4];

/**
 * 错误异常处理
 */
export const errorHandler = (error: any) => {
  const { response } = error;

  // 请求已发送但服务端返回状态码非 2xx 的响应
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;

    message.error(errorText);
  }

  throw error;
};

/**
 * 请求拦截器
 */
export const requestInterceptors: RequestInterceptor = (url, options) => {
  const loginInfo = localStorage.getItem('login');
  if (loginInfo) {
    const info = JSON.parse(loginInfo);

    return {
      url,
      options: {
        ...options,
        interceptors: true,
        headers: {
          Authorization: `Token ${info?.token}`,
          'X-CS-Header-App': 'qzh',
          'X-CS-Header-Company': info?.company_id,
          'X-CS-Header-Module': history.location.pathname?.slice(1),
        },
      },
    };
  }

  return {
    url: url,
    options: {
      ...options,
      interceptors: true,
      headers: {
        'X-CS-Header-App': 'qzh',
        'X-CS-Header-Module': history.location.pathname?.slice(1),
      },
    },
  };
};

/**
 * 响应拦截器
 */
export const responseParseInterceptor: ResponseInterceptor = async (response) => {
  if (response.status === 200) {
    const data = await response.clone().json();

    if (data.code === 0) {
      return data.data;
    } else {
      if (LOGIN_CODE.indexOf(data.code) !== -1) {
        const { location } = history;
        if (location.pathname !== LOGIN_PATH) {
          history.push(LOGIN_PATH);
        }
      }

      message.error(data.msg);
      throw new Error(data.msg);
    }
  }

  return response;
};

export const requestConfig: RequestConfig = {
  errorHandler,
  // 解决跨域问题
  credentials: 'include',
  prefix: '/qzh/api',
  responseInterceptors: [responseParseInterceptor],
  requestInterceptors: [requestInterceptors],
};
