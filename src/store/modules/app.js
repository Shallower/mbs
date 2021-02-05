var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '/@/store';
import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { setLocal, getLocal, clearSession, clearLocal } from '/@/utils/helper/persistent';
import { deepMerge } from '/@/utils';
import { resetRouter } from '/@/router';
import { permissionStore } from './permission';
import { tabStore } from './tab';
import { userStore } from './user';
let timeId;
const NAME = 'app';
hotModuleUnregisterModule(NAME);
let App = class App extends VuexModule {
    constructor() {
        super(...arguments);
        // Page loading status
        this.pageLoadingState = false;
        // project config
        this.projectConfigState = getLocal(PROJ_CFG_KEY);
        // set main overflow hidden
        this.lockMainScrollState = false;
    }
    get getPageLoading() {
        return this.pageLoadingState;
    }
    get getLockMainScrollState() {
        return this.lockMainScrollState;
    }
    get getProjectConfig() {
        return this.projectConfigState || {};
    }
    commitPageLoadingState(loading) {
        this.pageLoadingState = loading;
    }
    commitLockMainScrollState(lock) {
        this.lockMainScrollState = lock;
    }
    commitProjectConfigState(proCfg) {
        this.projectConfigState = deepMerge(this.projectConfigState || {}, proCfg);
        setLocal(PROJ_CFG_KEY, this.projectConfigState);
    }
    async resumeAllState() {
        resetRouter();
        clearSession();
        clearLocal();
        permissionStore.commitResetState();
        tabStore.commitResetState();
        userStore.commitResetState();
    }
    async setPageLoadingAction(loading) {
        if (loading) {
            clearTimeout(timeId);
            // Prevent flicker
            timeId = setTimeout(() => {
                this.commitPageLoadingState(loading);
            }, 50);
        }
        else {
            this.commitPageLoadingState(loading);
            clearTimeout(timeId);
        }
    }
};
__decorate([
    Mutation
], App.prototype, "commitPageLoadingState", null);
__decorate([
    Mutation
], App.prototype, "commitLockMainScrollState", null);
__decorate([
    Mutation
], App.prototype, "commitProjectConfigState", null);
__decorate([
    Action
], App.prototype, "resumeAllState", null);
__decorate([
    Action
], App.prototype, "setPageLoadingAction", null);
App = __decorate([
    Module({ dynamic: true, namespaced: true, store, name: NAME })
], App);
export const appStore = getModule(App);
//# sourceMappingURL=app.js.map