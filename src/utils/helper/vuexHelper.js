import store from '/@/store';
export function hotModuleUnregisterModule(name) {
    if (!name)
        return;
    if (store.state[name]) {
        store.unregisterModule(name);
    }
}
//# sourceMappingURL=vuexHelper.js.map