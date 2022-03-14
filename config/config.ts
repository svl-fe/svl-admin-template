// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import proxy from './proxy';
import theme from './theme';
import defaultSettings from './defaultSettings';
import SentryWebpackPlugin from '@sentry/webpack-plugin';
import pkg from '../package.json';

const { routes } = require('./routes'); // 采用 require 是为方便脚本执行

const { REACT_APP_ENV, UMI_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  devtool: 'source-map',
  dva: {
    hmr: true,
  },
  define: {
    APP_ENV: REACT_APP_ENV,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme,
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  // publicPath: process.env.NODE_ENV === 'production' ? '/svl-admin-template/' : '/',
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack: function (memo) {
    // 本地开发无需上传 sourcemap
    if (!UMI_ENV && REACT_APP_ENV) {
      memo.plugin('sentry').use(SentryWebpackPlugin, [
        {
          // sentry-cli configuration
          configFile: './sentryclirc',
          release: pkg.version,
          urlPrefix: '~/',

          // webpack specifice configuration
          include: './dist',
          ignore: ['node_modules', 'config'],
        },
      ]);
    }
  },
});
