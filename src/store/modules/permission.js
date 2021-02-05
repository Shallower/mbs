var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import store from '/@/store/index';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { VuexModule, Mutation, Module, getModule, Action } from 'vuex-module-decorators';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import { asyncRoutes } from '/@/router/routes';
import { filter } from '/@/utils/helper/treeHelper';
import { toRaw } from 'vue';
import { getMenuListById } from '/@/api/sys/menu';
import { transformObjToRoute } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { useMessage } from '/@/hooks/web/useMessage';
// import { warn } from '/@/utils/log';
import { useI18n } from '/@/hooks/web/useI18n';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/constant';
const { createMessage } = useMessage();
const NAME = 'permission';
hotModuleUnregisterModule(NAME);
let Permission = class Permission extends VuexModule {
    constructor() {
        super(...arguments);
        // Permission code list
        this.permCodeListState = [];
        // Whether the route has been dynamically added
        this.isDynamicAddedRouteState = false;
        // To trigger a menu update
        this.lastBuildMenuTimeState = 0;
        // Backstage menu list
        this.backMenuListState = [];
    }
    get getPermCodeListState() {
        return this.permCodeListState;
    }
    get getBackMenuListState() {
        return this.backMenuListState;
    }
    get getLastBuildMenuTimeState() {
        return this.lastBuildMenuTimeState;
    }
    get getIsDynamicAddedRouteState() {
        return this.isDynamicAddedRouteState;
    }
    commitPermCodeListState(codeList) {
        this.permCodeListState = codeList;
    }
    commitBackMenuListState(list) {
        this.backMenuListState = list;
    }
    commitLastBuildMenuTimeState() {
        this.lastBuildMenuTimeState = new Date().getTime();
    }
    commitDynamicAddedRouteState(added) {
        this.isDynamicAddedRouteState = added;
    }
    commitResetState() {
        this.isDynamicAddedRouteState = false;
        this.permCodeListState = [];
        this.backMenuListState = [];
        this.lastBuildMenuTimeState = 0;
    }
    async buildRoutesAction(id) {
        const { t } = useI18n();
        let routes = [];
        const roleList = toRaw(userStore.getRoleListState);
        const { permissionMode } = appStore.getProjectConfig;
        // role permissions
        if (permissionMode === PermissionModeEnum.ROLE) {
            routes = filter(asyncRoutes, (route) => {
                const { meta } = route;
                const { roles } = meta || {};
                if (!roles)
                    return true;
                return roleList.some((role) => roles.includes(role));
            });
            //  如果确定不需要做后台动态权限,请将下面整个判断注释
        }
        else if (permissionMode === PermissionModeEnum.BACK) {
            createMessage.loading({
                content: t('sys.app.menuLoading'),
                duration: 1,
            });
            // 这里获取后台路由菜单逻辑自行修改
            const paramId = id || userStore.getUserInfoState.userId;
            if (!paramId) {
                throw new Error('paramId is undefined!');
            }
            let routeList = (await getMenuListById({ id: paramId }));
            // 动态引入组件
            routeList = transformObjToRoute(routeList);
            //  后台路由转菜单结构
            const backMenuList = transformRouteToMenu(routeList);
            this.commitBackMenuListState(backMenuList);
            routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
        }
        return routes;
    }
};
__decorate([
    Mutation
], Permission.prototype, "commitPermCodeListState", null);
__decorate([
    Mutation
], Permission.prototype, "commitBackMenuListState", null);
__decorate([
    Mutation
], Permission.prototype, "commitLastBuildMenuTimeState", null);
__decorate([
    Mutation
], Permission.prototype, "commitDynamicAddedRouteState", null);
__decorate([
    Mutation
], Permission.prototype, "commitResetState", null);
__decorate([
    Action
], Permission.prototype, "buildRoutesAction", null);
Permission = __decorate([
    Module({ dynamic: true, namespaced: true, store, name: NAME })
], Permission);
export const permissionStore = getModule(Permission);
//# sourceMappingURL=permission.js.map