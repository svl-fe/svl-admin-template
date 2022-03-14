const { routes } = require('../config/routes');
const fs = require('fs');

// console.log('routes:', routes);

// 获取中英文路由映射
const getRouteLocaleMap = (routes) => {
  let routeMap = {};
  routes.map((route) => {
    if (route.locales && route.path) {
      routeMap[`${route.name}`] = route.locales;
    }

    if (route.routes) {
      const subRouteMap = getRouteLocaleMap(route.routes);
      routeMap = { ...routeMap, ...subRouteMap };
    }
  });

  return routeMap;
};

// 获取纯路由，用于服务端
const getPureRoutes = (routes, keys = []) => {
  let new_route = [];

  routes.map((item) => {
    let parentRoute = {};
    keys.map((key) => {
      if (item[key]) {
        parentRoute[key] = item[key];
      }
      console.log('key:', key, item[key], parentRoute[key]);
    });

    if (item.routes) {
      const subRoutes = getPureRoutes(item.routes, keys);
      parentRoute['routes'] = subRoutes;
    }

    if (JSON.stringify(parentRoute) !== '{}') {
      new_route.push(parentRoute);
    }
  });

  return new_route;
};

fs.writeFile(
  'RouteLocale.json',
  JSON.stringify(getRouteLocaleMap(routes)),
  'utf-8',
  function (error) {
    if (error) {
      console.log('write error:', error);
      return false;
    }

    console.log('写入成功');
  },
);

fs.writeFile(
  'SimpleRoute.json',
  JSON.stringify(getPureRoutes(routes, ['path'])),
  'utf-8',
  function (error) {
    if (error) {
      console.log('write error:', error);
      return false;
    }

    console.log('写入成功');
  },
);
