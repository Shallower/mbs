/**
 * Used to monitor routing changes to change the status of menus and tabs. There is no need to monitor the route, because the route status change is affected by the page rendering time, which will be slow
 */
import Mitt from '/@/utils/mitt';
import { getRoute } from '/@/router/helper/routeHelper';
const mitt = new Mitt();
const key = Symbol();
let lastChangeTab;
export function setLastChangeTab(lastChangeRoute) {
    const r = getRoute(lastChangeRoute);
    mitt.emit(key, r);
    lastChangeTab = r;
}
export function listenerLastChangeTab(callback, immediate = true) {
    mitt.on(key, callback);
    immediate && callback(lastChangeTab);
}
export function removeTabChangeListener() {
    mitt.clear();
}
//# sourceMappingURL=tabChange.js.map