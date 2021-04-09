var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '/@/store';
import { LOCK_INFO_KEY } from '/@/enums/cacheEnum';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { setLocal, getLocal, removeLocal } from '/@/utils/helper/persistent';
import { userStore } from './user';
const NAME = 'lock';
hotModuleUnregisterModule(NAME);
let Lock = class Lock extends VuexModule {
  constructor() {
    super(...arguments);
    // lock info
    this.lockInfoState = getLocal(LOCK_INFO_KEY);
  }
  get getLockInfo() {
    return this.lockInfoState || {};
  }
  commitLockInfoState(info) {
    this.lockInfoState = Object.assign({}, this.lockInfoState, info);
    setLocal(LOCK_INFO_KEY, this.lockInfoState);
  }
  resetLockInfo() {
    removeLocal(LOCK_INFO_KEY);
    this.lockInfoState = null;
  }
  /**
   * @description: unlock page
   */
  async unLockAction({ password }) {
    const tryLogin = async () => {
      try {
        const username = userStore.getUserInfoState.username;
        const res = await userStore.login({ username, password, goHome: false, mode: 'none' });
        if (res) {
          this.resetLockInfo();
        }
        return res;
      } catch (error) {
        return false;
      }
    };
    if (this.getLockInfo?.pwd === password) {
      this.resetLockInfo();
      return true;
    }
    return await tryLogin();
  }
};
__decorate([Mutation], Lock.prototype, 'commitLockInfoState', null);
__decorate([Mutation], Lock.prototype, 'resetLockInfo', null);
__decorate([Action], Lock.prototype, 'unLockAction', null);
Lock = __decorate([Module({ dynamic: true, namespaced: true, store, name: NAME })], Lock);
export const lockStore = getModule(Lock);
//# sourceMappingURL=lock.js.map
