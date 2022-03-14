const routes = [
  {
    name: 'user',
    locales: '用户',
    path: '/user',
    hideInMenu: true,
    layout: false,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'login',
        locales: '登录',
        path: '/user/login',
        layout: false,
        component: './user/Login',
      },
      {
        component: '404',
      },
    ],
  },
  {
    name: 'home',
    locales: '首页分析',
    path: '/home',
    selectedIcon: 'icon-shouye-xuanzhong',
    unselectedIcon: 'icon-shouye-weixuanzhong',
    routes: [
      {
        path: '/home',
        redirect: '/home/data-view',
      },
      {
        name: 'data-view',
        locales: '风险总览',
        path: '/home/data-view',
        component: './data-view',
      },
    ],
  },
  {
    name: 'strategy-center',
    locales: '策略中心',
    path: '/strategy-center',
    unselectedIcon: 'icon-celvezhongxin-weixuanzhong',
    selectedIcon: 'icon-celvezhongxin-xuanzhong',
    routes: [
      {
        name: 'risk-rules',
        locales: '风险规则',
        path: '/strategy-center/risk-rules',
        component: './strategy-center/risk-rules',
      },
    ],
  },
  {
    name: 'system-settings',
    locales: '系统设置',
    path: '/system-settings',
    unselectedIcon: 'icon-xitongshezhi-weixuanzhong',
    selectedIcon: 'icon-xitongshezhi-xuanzhong',
    routes: [
      {
        path: '/system-settings',
        redirect: '/system-settings/system-admin',
      },
      {
        name: 'system-admin',
        locales: '系统管理员',
        path: '/system-settings/system-admin',
        component: './system-settings/system-admin',
      },
    ],
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: '404',
  },
];

module.exports = {
  routes,
};
