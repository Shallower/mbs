var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import store from '/@/store/index';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { PageEnum } from '/@/enums/pageEnum';
import { CacheTypeEnum, ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { useMessage } from '/@/hooks/web/useMessage';
import router from '/@/router';
import { loginApi, getUserInfoById } from '/@/api/sys/user';
import { setLocal, getLocal, getSession, setSession } from '/@/utils/helper/persistent';
import { useProjectSetting } from '/@/hooks/setting';
import { useI18n } from '/@/hooks/web/useI18n';
const NAME = 'user';
hotModuleUnregisterModule(NAME);
const { permissionCacheType } = useProjectSetting();
function getCache(key) {
    const fn = permissionCacheType === CacheTypeEnum.LOCAL ? getLocal : getSession;
    return fn(key);
}
function setCache(USER_INFO_KEY, info) {
    if (!info)
        return;
    // const fn = permissionCacheType === CacheTypeEnum.LOCAL ? setLocal : setSession;
    setLocal(USER_INFO_KEY, info, true);
    // TODO
    setSession(USER_INFO_KEY, info, true);
}
let User = class User extends VuexModule {
    constructor() {
        super(...arguments);
        // user info
        this.userInfoState = null;
        // token
        this.tokenState = '';
        // roleList
        this.roleListState = [];
    }
    get getUserInfoState() {
        return this.userInfoState || getCache(USER_INFO_KEY) || {};
    }
    get getTokenState() {
        return this.tokenState || getCache(TOKEN_KEY);
    }
    get getRoleListState() {
        return this.roleListState.length > 0 ? this.roleListState : getCache(ROLES_KEY);
    }
    commitResetState() {
        this.userInfoState = null;
        this.tokenState = '';
        this.roleListState = [];
    }
    commitUserInfoState(info) {
        this.userInfoState = info;
        setCache(USER_INFO_KEY, info);
    }
    commitRoleListState(roleList) {
        this.roleListState = roleList;
        setCache(ROLES_KEY, roleList);
    }
    commitTokenState(info) {
        this.tokenState = info;
        setCache(TOKEN_KEY, info);
    }
    /**
     * @description: login
     */
    async login(params) {
        try {
            const { goHome = true, mode, ...loginParams } = params;
            const data = await loginApi(loginParams, mode);
            const { token, userId } = data;
            // save token
            this.commitTokenState(token);
            // get user info
            const userInfo = await this.getUserInfoAction({ userId });
            // const name = FULL_PAGE_NOT_FOUND_ROUTE.name;
            // name && router.removeRoute(name);
            goHome && (await router.replace(PageEnum.BASE_HOME));
            return userInfo;
        }
        catch (error) {
            return null;
        }
    }
    async getUserInfoAction({ userId }) {
        const userInfo = await getUserInfoById({ userId });
        const { role } = userInfo;
        const roleList = [role.value];
        this.commitUserInfoState(userInfo);
        this.commitRoleListState(roleList);
        return userInfo;
    }
    /**
     * @description: login out
     */
    async loginOut(goLogin = false) {
        goLogin && router.push(PageEnum.BASE_LOGIN);
    }
    /**
     * @description: Confirm before logging out
     */
    async confirmLoginOut() {
        const { createConfirm } = useMessage();
        const { t } = useI18n();
        createConfirm({
            iconType: 'warning',
            title: t('sys.app.loginOutTip'),
            content: t('sys.app.loginOutMessage'),
            onOk: async () => {
                await this.loginOut(true);
            },
        });
    }
};
__decorate([
    Mutation
], User.prototype, "commitResetState", null);
__decorate([
    Mutation
], User.prototype, "commitUserInfoState", null);
__decorate([
    Mutation
], User.prototype, "commitRoleListState", null);
__decorate([
    Mutation
], User.prototype, "commitTokenState", null);
__decorate([
    Action
], User.prototype, "login", null);
__decorate([
    Action
], User.prototype, "getUserInfoAction", null);
__decorate([
    Action
], User.prototype, "loginOut", null);
__decorate([
    Action
], User.prototype, "confirmLoginOut", null);
User = __decorate([
    Module({ namespaced: true, name: NAME, dynamic: true, store })
], User);
export const userStore = getModule(User);
//# sourceMappingURL=user.js.map