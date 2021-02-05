import { i18n } from '/@/locales/setupI18n';
export function useI18n(namespace) {
    function getKey(key) {
        if (!namespace) {
            return key;
        }
        if (key.startsWith(namespace)) {
            return key;
        }
        return `${namespace}.${key}`;
    }
    const normalFn = {
        t: (key) => {
            return getKey(key);
        },
    };
    if (!i18n) {
        return normalFn;
    }
    const { t, ...methods } = i18n.global;
    const tFn = (key, ...arg) => {
        if (!key)
            return '';
        return t(getKey(key), ...arg);
    };
    return {
        ...methods,
        t: tFn,
    };
}
// Why write this function？
// Mainly to configure the vscode i18nn ally plugin. This function is only used for routing and menus. Please use useI18n for other places
// 为什么要编写此函数？
// 主要用于配合vscode i18nn ally插件。此功能仅用于路由和菜单。请在其他地方使用useI18n
export const t = (key) => key;
//# sourceMappingURL=useI18n.js.map