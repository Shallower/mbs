import { setLastChangeTab } from '/@/logics/mitt/tabChange';
export function createPageGuard(router) {
    const loadedPageMap = new Map();
    router.beforeEach(async (to) => {
        to.meta.loaded = !!loadedPageMap.get(to.path);
        // Notify routing changes
        setLastChangeTab(to);
        return true;
    });
    router.afterEach((to) => {
        loadedPageMap.set(to.path, true);
    });
}
//# sourceMappingURL=pageGuard.js.map