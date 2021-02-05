var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { toRaw } from 'vue';
import { unref } from 'vue';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { PageEnum } from '/@/enums/pageEnum';
import store from '/@/store';
import router from '/@/router';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/constant';
import { getRoute } from '/@/router/helper/routeHelper';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { cloneDeep } from 'lodash-es';
const NAME = 'tab';
hotModuleUnregisterModule(NAME);
export const PAGE_LAYOUT_KEY = '__PAGE_LAYOUT__';
function isGotoPage() {
    const go = useGo();
    go(unref(router.currentRoute).path, true);
}
let Tab = class Tab extends VuexModule {
    constructor() {
        super(...arguments);
        this.cachedMapState = new Map();
        // tab list
        this.tabsState = [];
        this.lastDragEndIndexState = 0;
    }
    get getTabsState() {
        return this.tabsState;
    }
    get getCurrentTab() {
        const route = unref(router.currentRoute);
        return this.tabsState.find((item) => item.path === route.path);
    }
    get getCachedMapState() {
        return this.cachedMapState;
    }
    get getLastDragEndIndexState() {
        return this.lastDragEndIndexState;
    }
    commitClearCache() {
        this.cachedMapState = new Map();
    }
    goToPage() {
        const go = useGo();
        const len = this.tabsState.length;
        const { path } = unref(router.currentRoute);
        let toPath = PageEnum.BASE_HOME;
        if (len > 0) {
            const page = this.tabsState[len - 1];
            const p = page.fullPath || page.path;
            if (p) {
                toPath = p;
            }
        }
        // Jump to the current page and report an error
        path !== toPath && go(toPath, true);
    }
    commitCachedMapState() {
        const cacheMap = new Map();
        const pageCacheSet = new Set();
        this.tabsState.forEach((tab) => {
            const item = getRoute(tab);
            const needCache = !item.meta?.ignoreKeepAlive;
            if (!needCache)
                return;
            if (item.meta?.affix) {
                const name = item.name;
                pageCacheSet.add(name);
            }
            else if (item?.matched && needCache) {
                const matched = item?.matched;
                if (!matched)
                    return;
                const len = matched.length;
                if (len < 2)
                    return;
                for (let i = 0; i < matched.length; i++) {
                    const key = matched[i].name;
                    if (i < 2) {
                        pageCacheSet.add(key);
                    }
                    if (i < len - 1) {
                        const { meta, name } = matched[i + 1];
                        if (meta && (meta.affix || needCache)) {
                            const mapList = cacheMap.get(key) || [];
                            if (!mapList.includes(name)) {
                                mapList.push(name);
                            }
                            cacheMap.set(key, mapList);
                        }
                    }
                }
            }
        });
        cacheMap.set(PAGE_LAYOUT_KEY, Array.from(pageCacheSet));
        this.cachedMapState = cacheMap;
    }
    commitTabRoutesState(route) {
        const { path, fullPath, params, query } = route;
        let updateIndex = -1;
        // 已经存在的页面，不重复添加tab
        const hasTab = this.tabsState.some((tab, index) => {
            updateIndex = index;
            return (tab.fullPath || tab.path) === (fullPath || path);
        });
        if (hasTab) {
            const curTab = toRaw(this.tabsState)[updateIndex];
            if (!curTab)
                return;
            curTab.params = params || curTab.params;
            curTab.query = query || curTab.query;
            curTab.fullPath = fullPath || curTab.fullPath;
            this.tabsState.splice(updateIndex, 1, curTab);
            return;
        }
        this.tabsState = cloneDeep([...this.tabsState, route]);
    }
    /**
     * @description: close tab
     */
    commitCloseTab(route) {
        const { fullPath, meta: { affix } = {} } = route;
        if (affix)
            return;
        const index = this.tabsState.findIndex((item) => item.fullPath === fullPath);
        index !== -1 && this.tabsState.splice(index, 1);
    }
    commitCloseAllTab() {
        this.tabsState = this.tabsState.filter((item) => {
            return item.meta && item.meta.affix;
        });
    }
    commitResetState() {
        this.tabsState = [];
        this.cachedMapState = new Map();
    }
    commitSortTabs({ oldIndex, newIndex }) {
        const currentTab = this.tabsState[oldIndex];
        this.tabsState.splice(oldIndex, 1);
        this.tabsState.splice(newIndex, 0, currentTab);
        this.lastDragEndIndexState = this.lastDragEndIndexState + 1;
    }
    closeMultipleTab({ pathList }) {
        this.tabsState = toRaw(this.tabsState).filter((item) => !pathList.includes(item.fullPath));
    }
    addTabAction(route) {
        const { path, name } = route;
        // 404  The page does not need to add a tab
        if (path === PageEnum.ERROR_PAGE ||
            !name ||
            [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name)) {
            return;
        }
        this.commitTabRoutesState(getRoute(route));
        this.commitCachedMapState();
    }
    async commitRedoPage() {
        const route = router.currentRoute.value;
        for (const [key, value] of this.cachedMapState) {
            const index = value.findIndex((item) => item === route.name);
            if (index === -1) {
                continue;
            }
            if (value.length === 1) {
                this.cachedMapState.delete(key);
                continue;
            }
            value.splice(index, 1);
            this.cachedMapState.set(key, value);
        }
        const redo = useRedo();
        await redo();
    }
    closeAllTabAction() {
        this.commitCloseAllTab();
        this.commitClearCache();
        this.goToPage();
    }
    closeTabAction(tab) {
        function getObj(tabItem) {
            const { params, path, query } = tabItem;
            return {
                params: params || {},
                path,
                query: query || {},
            };
        }
        const { currentRoute, replace } = router;
        const { path } = unref(currentRoute);
        if (path !== tab.path) {
            // Closed is not the activation tab
            this.commitCloseTab(tab);
            return;
        }
        // Closed is activated atb
        let toObj = {};
        const index = this.getTabsState.findIndex((item) => item.path === path);
        // If the current is the leftmost tab
        if (index === 0) {
            // There is only one tab, then jump to the homepage, otherwise jump to the right tab
            if (this.getTabsState.length === 1) {
                toObj = PageEnum.BASE_HOME;
            }
            else {
                //  Jump to the right tab
                const page = this.getTabsState[index + 1];
                toObj = getObj(page);
            }
        }
        else {
            // Close the current tab
            const page = this.getTabsState[index - 1];
            toObj = getObj(page);
        }
        this.commitCloseTab(currentRoute.value);
        replace(toObj);
    }
    closeTabByKeyAction(key) {
        const index = this.tabsState.findIndex((item) => (item.fullPath || item.path) === key);
        index !== -1 && this.closeTabAction(this.tabsState[index]);
    }
    closeLeftTabAction(route) {
        const index = this.tabsState.findIndex((item) => item.path === route.path);
        if (index > 0) {
            const leftTabs = this.tabsState.slice(0, index);
            const pathList = [];
            for (const item of leftTabs) {
                const affix = item.meta ? item.meta.affix : false;
                if (!affix) {
                    pathList.push(item.fullPath);
                }
            }
            this.closeMultipleTab({ pathList });
        }
        this.commitCachedMapState();
        isGotoPage();
    }
    closeRightTabAction(route) {
        const index = this.tabsState.findIndex((item) => item.fullPath === route.fullPath);
        if (index >= 0 && index < this.tabsState.length - 1) {
            const rightTabs = this.tabsState.slice(index + 1, this.tabsState.length);
            const pathList = [];
            for (const item of rightTabs) {
                const affix = item.meta ? item.meta.affix : false;
                if (!affix) {
                    pathList.push(item.fullPath);
                }
            }
            this.closeMultipleTab({ pathList });
        }
        this.commitCachedMapState();
        isGotoPage();
    }
    closeOtherTabAction(route) {
        const closePathList = this.tabsState.map((item) => item.fullPath);
        const pathList = [];
        closePathList.forEach((path) => {
            if (path !== route.fullPath) {
                const closeItem = this.tabsState.find((item) => item.path === path);
                if (!closeItem)
                    return;
                const affix = closeItem.meta ? closeItem.meta.affix : false;
                if (!affix) {
                    pathList.push(closeItem.fullPath);
                }
            }
        });
        this.closeMultipleTab({ pathList });
        this.commitCachedMapState();
        isGotoPage();
    }
};
__decorate([
    Mutation
], Tab.prototype, "commitClearCache", null);
__decorate([
    Mutation
], Tab.prototype, "goToPage", null);
__decorate([
    Mutation
], Tab.prototype, "commitCachedMapState", null);
__decorate([
    Mutation
], Tab.prototype, "commitTabRoutesState", null);
__decorate([
    Mutation
], Tab.prototype, "commitCloseTab", null);
__decorate([
    Mutation
], Tab.prototype, "commitCloseAllTab", null);
__decorate([
    Mutation
], Tab.prototype, "commitResetState", null);
__decorate([
    Mutation
], Tab.prototype, "commitSortTabs", null);
__decorate([
    Mutation
], Tab.prototype, "closeMultipleTab", null);
__decorate([
    Action
], Tab.prototype, "addTabAction", null);
__decorate([
    Mutation
], Tab.prototype, "commitRedoPage", null);
__decorate([
    Action
], Tab.prototype, "closeAllTabAction", null);
__decorate([
    Action
], Tab.prototype, "closeTabAction", null);
__decorate([
    Action
], Tab.prototype, "closeTabByKeyAction", null);
__decorate([
    Action
], Tab.prototype, "closeLeftTabAction", null);
__decorate([
    Action
], Tab.prototype, "closeRightTabAction", null);
__decorate([
    Action
], Tab.prototype, "closeOtherTabAction", null);
Tab = __decorate([
    Module({ namespaced: true, name: NAME, dynamic: true, store })
], Tab);
export const tabStore = getModule(Tab);
//# sourceMappingURL=tab.js.map