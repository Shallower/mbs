import { createStorage } from '/@/utils/cache';
import { isIeFn } from '/@/utils/browser';
import { BASE_LOCAL_CACHE_KEY, BASE_SESSION_CACHE_KEY } from '/@/enums/cacheEnum';
const ls = createStorage(localStorage);
const ss = createStorage();
/**
 * @description:  Persistent cache
 */
const cacheStore = {
  // localstorage cache
  local: {},
  // sessionstorage cache
  session: {},
};
function initCache() {
  cacheStore.local = ls.get(BASE_LOCAL_CACHE_KEY) || {};
  cacheStore.session = ss.get(BASE_SESSION_CACHE_KEY) || {};
}
initCache();
export function setLocal(key, value, immediate = false) {
  const local = ls.get(BASE_LOCAL_CACHE_KEY)?.[BASE_LOCAL_CACHE_KEY] || {};
  cacheStore.local[BASE_LOCAL_CACHE_KEY] =
    { ...local, ...cacheStore.local[BASE_LOCAL_CACHE_KEY] } || {};
  cacheStore.local[BASE_LOCAL_CACHE_KEY][key] = value;
  if (immediate) {
    ls.set(BASE_LOCAL_CACHE_KEY, cacheStore.local);
  }
}
export function getLocal(key) {
  try {
    return cacheStore.local[BASE_LOCAL_CACHE_KEY][key];
  } catch (error) {
    return null;
  }
}
export function removeLocal(key) {
  if (cacheStore.local[BASE_LOCAL_CACHE_KEY]) {
    Reflect.deleteProperty(cacheStore.local[BASE_LOCAL_CACHE_KEY], key);
  }
}
export function clearLocal(immediate = false) {
  cacheStore.local = {};
  immediate && ls.remove(BASE_LOCAL_CACHE_KEY);
}
export function setSession(key, value, immediate = false) {
  const session = ss.get(BASE_SESSION_CACHE_KEY)?.[BASE_SESSION_CACHE_KEY] || {};
  cacheStore.session[BASE_SESSION_CACHE_KEY] =
    { ...session, ...cacheStore.session[BASE_SESSION_CACHE_KEY] } || {};
  cacheStore.session[BASE_SESSION_CACHE_KEY][key] = value;
  if (immediate) {
    ss.set(BASE_SESSION_CACHE_KEY, cacheStore.session);
  }
}
export function removeSession(key) {
  if (cacheStore.session[BASE_SESSION_CACHE_KEY]) {
    Reflect.deleteProperty(cacheStore.session[BASE_SESSION_CACHE_KEY], key);
  }
}
export function getSession(key) {
  try {
    return cacheStore.session[BASE_SESSION_CACHE_KEY][key];
  } catch (error) {
    return null;
  }
}
export function clearSession(immediate = false) {
  cacheStore.session = {};
  immediate && ss.remove(BASE_SESSION_CACHE_KEY);
}
export function clearAll() {
  clearLocal();
  clearSession();
}
export function persistentCache() {
  const localCache = cacheStore.local;
  const sessionCache = cacheStore.session;
  ls.set(BASE_LOCAL_CACHE_KEY, localCache);
  ss.set(BASE_SESSION_CACHE_KEY, sessionCache);
}
(() => {
  // /** Write to local before closing window */
  window.addEventListener('beforeunload', () => {
    persistentCache();
  });
  function storageChange(e) {
    const { key, newValue, oldValue } = e;
    if (!key) {
      clearAll();
      return;
    }
    if (!!newValue && !!oldValue) {
      if (BASE_LOCAL_CACHE_KEY === key) {
        clearLocal();
      }
      if (BASE_SESSION_CACHE_KEY === key) {
        clearSession();
      }
    }
  }
  if (isIeFn() && document.attachEvent) {
    document.attachEvent('onstorage', storageChange);
  } else {
    window.addEventListener('storage', storageChange);
  }
})();
//# sourceMappingURL=persistent.js.map
