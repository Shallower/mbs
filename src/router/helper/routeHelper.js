import { getParentLayout, LAYOUT } from '/@/router/constant';
import { cloneDeep } from 'lodash-es';
import { warn } from '/@/utils/log';
const LayoutMap = new Map();
const dynamicViewsModules = import.meta.glob('../../views/**/*.{vue,tsx}');
// 动态引入
function asyncImportRoute(routes) {
    if (!routes)
        return;
    routes.forEach((item) => {
        const { component, name } = item;
        const { children } = item;
        if (component) {
            item.component = dynamicImport(dynamicViewsModules, component);
        }
        else if (name) {
            item.component = getParentLayout(name);
        }
        children && asyncImportRoute(children);
    });
}
function dynamicImport(dynamicViewsModules, component) {
    const keys = Object.keys(dynamicViewsModules);
    const matchKeys = keys.filter((key) => {
        const k = key.replace('../../views', '');
        return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
    });
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0];
        return dynamicViewsModules[matchKey];
    }
    if (matchKeys?.length > 1) {
        warn('Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure');
        return;
    }
}
// Turn background objects into routing objects
export function transformObjToRoute(routeList) {
    LayoutMap.set('LAYOUT', LAYOUT);
    routeList.forEach((route) => {
        if (route.component) {
            if (route.component.toUpperCase() === 'LAYOUT') {
                route.component = LayoutMap.get(route.component);
            }
            else {
                route.children = [cloneDeep(route)];
                route.component = LAYOUT;
                route.name = `${route.name}Parent`;
                route.path = '';
                const meta = route.meta || {};
                meta.single = true;
                meta.affix = false;
                route.meta = meta;
            }
        }
        route.children && asyncImportRoute(route.children);
    });
    return routeList;
}
// Return to the new routing structure, not affected by the original example
export function getRoute(route) {
    if (!route)
        return route;
    const { matched, ...opt } = route;
    return {
        ...opt,
        matched: (matched
            ? matched.map((item) => ({
                meta: item.meta,
                name: item.name,
                path: item.path,
            }))
            : undefined),
    };
}
//# sourceMappingURL=routeHelper.js.map