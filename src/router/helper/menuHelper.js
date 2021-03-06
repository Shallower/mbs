import { findPath, forEach, treeMap } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { isUrl } from '/@/utils/is';
export function getAllParentPath(treeData, path) {
  const menuList = findPath(treeData, (n) => n.path === path);
  return (menuList || []).map((item) => item.path);
}
// 拼接父级路径
function joinParentPath(list, node) {
  let allPaths = getAllParentPath(list, node.path);
  allPaths = allPaths.slice(0, allPaths.length - 1);
  let parentPath = '';
  if (Array.isArray(allPaths) && allPaths.length >= 2) {
    parentPath = allPaths[allPaths.length - 1];
  } else {
    allPaths.forEach((p) => {
      parentPath += /^\//.test(p) ? p : `/${p}`;
    });
  }
  node.path = `${/^\//.test(node.path) ? node.path : `${parentPath}/${node.path}`}`.replace(
    /\/\//g,
    '/'
  );
  return node;
}
// 解析菜单模块
export function transformMenuModule(menuModule) {
  const { menu } = menuModule;
  const menuList = [menu];
  forEach(menuList, (m) => {
    !isUrl(m.path) && joinParentPath(menuList, m);
  });
  return menuList[0];
}
export function transformRouteToMenu(routeModList) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList = [];
  // cloneRouteModList = filter(cloneRouteModList, (node) => {
  //   if (Reflect.has(node?.meta ?? {}, 'hideMenu')) {
  //     return !node?.meta.hideMenu;
  //   }
  //   return true;
  // });
  cloneRouteModList.forEach((item) => {
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  return treeMap(routeList, {
    conversion: (node) => {
      const { meta: { title, icon, hideMenu = false } = {} } = node;
      !isUrl(node.path) && joinParentPath(routeList, node);
      return {
        name: title,
        icon,
        path: node.path,
        hideMenu,
      };
    },
  });
}
//# sourceMappingURL=menuHelper.js.map
