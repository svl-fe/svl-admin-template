import type { RunTimeLayoutConfig } from 'umi';
import { Link, history } from 'umi';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { PageLoading } from '@ant-design/pro-layout';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import MyIcon from '@/components/Icon';
// import { currentUser as queryCurrentUser } from './services/login';
import { requestConfig } from '@/utils/request';
import { isMatchRoute } from '@/utils/route';
import Header from '@/components/Header';
import pkg from '../package.json';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

console.log('env:', process.env.NODE_ENV);

// 本地开发的时候不进行 Sentry 的日志上报
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'http://fd93f74cb3ee43a28317d41752881c86@8.130.10.180:9000/3',
    integrations: [new BrowserTracing()],
    release: pkg.version,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    //@ts-ignore
    environment: APP_ENV,
  });
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 *
 * 注：会在整个应用最开始执行，返回值会作为全局共享的数据。Layout 插件、Access 插件
 * 以及用户都可以通过 useModel('@@initialState') 直接获取到这份数据！！！
 * */
export async function getInitialState(): Promise<{
  login: any;
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  let login: any = undefined;

  const loginInfo = localStorage.getItem('login');
  if (loginInfo) {
    login = JSON.parse(loginInfo);
  }

  // const fetchUserInfo = async () => {
  //   try {
  //     const msg = await queryCurrentUser();
  //     return msg.data;
  //   } catch (error) {
  //     // 鉴权有问题，会从该入口跳转至登录页！！！
  //     // history.push(loginPath);
  //   }
  //   return undefined;
  // };

  // 如果是登录页面，不执行
  // if (history.location.pathname !== loginPath) {
  //   const currentUser = await fetchUserInfo();
  //   return {
  //     fetchUserInfo,
  //     currentUser,
  //     settings: {},
  //   };
  // }

  return {
    login,
    // fetchUserInfo,
    currentUser: {
      name: login?.name || '匿名',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    siderWidth: 200,
    headerRender: ({ collapsed }) => <Header collapsed={collapsed} />,
    disableContentMargin: false,
    subMenuItemRender: (_, dom) => {
      const { selectedIcon, unselectedIcon, path } = _;
      return (
        <div>
          {isMatchRoute(path) ? <MyIcon type={selectedIcon} /> : <MyIcon type={unselectedIcon} />}
          {dom}
        </div>
      );
    },
    breadcrumbRender: (routes) => {
      return routes?.map((route) => {
        // @ts-ignore
        if (!route.component) {
          route.breadcrumbName = '';
        }
        return route;
      });
    },
    breadcrumbProps: {
      itemRender: (route, _params, routes) => {
        const { breadcrumbName, path } = route;
        const index = routes.findIndex((item) => item.path === path);
        const flag = index !== routes.length - 1;
        const clickF = () => {
          history.push(path);
        };
        return breadcrumbName ? (
          <span
            onClick={flag ? clickF : undefined}
            style={flag ? { cursor: 'pointer' } : undefined}
          >
            {breadcrumbName}
          </span>
        ) : null;
      },
    },
    onPageChange: () => {
      const { location } = history;

      // 如果没有登录，重定向到 login
      if (!initialState?.login && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          // eslint-disable-next-line react/jsx-key
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          // eslint-disable-next-line react/jsx-key
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

export const request = requestConfig;
