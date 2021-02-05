import { computed, toRaw } from 'vue';
import { unref } from 'vue';
import { es6Unique } from '/@/utils';
import { getAllParentPath } from '/@/router/helper/menuHelper';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';
export function useOpenKeys(menuState, menus, accordion, mixSider, collapse
// mode: Ref<MenuModeEnum>,
) {
    async function setOpenKeys(path) {
        // if (mode.value === MenuModeEnum.HORIZONTAL) {
        //   return;
        // }
        const native = !mixSider.value;
        useTimeoutFn(() => {
            const menuList = toRaw(menus.value);
            if (menuList?.length === 0) {
                menuState.activeSubMenuNames = [];
                menuState.openNames = [];
                return;
            }
            const keys = getAllParentPath(menuList, path);
            if (!unref(accordion)) {
                menuState.openNames = es6Unique([...menuState.openNames, ...keys]);
            }
            else {
                menuState.openNames = keys;
            }
            menuState.activeSubMenuNames = menuState.openNames;
        }, 16, native);
    }
    const getOpenKeys = computed(() => {
        return unref(collapse) ? [] : menuState.openNames;
    });
    return { setOpenKeys, getOpenKeys };
}
//# sourceMappingURL=useOpenKeys.js.map