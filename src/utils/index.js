export const timestamp = () => +Date.now();
import { unref } from 'vue';
import { isObject } from '/@/utils/is';
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export const noop = () => {};
export const now = () => Date.now();
/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node) {
  return node?.parentNode ?? document.body;
}
/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl, obj) {
  let parameters = '';
  let url = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
}
export function deepMerge(src = {}, target = {}) {
  let key;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}
/**
 * @description: 根据数组中某个对象值去重
 */
export function unique(arr, key) {
  const map = new Map();
  return arr.filter((item) => {
    const _item = item;
    return !map.has(_item[key]) && map.set(_item[key], 1);
  });
}
/**
 * @description: es6数组去重复
 */
export function es6Unique(arr) {
  return Array.from(new Set(arr));
}
export function openWindow(url, opt) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature = [];
  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');
  window.open(url, target, feature.join(','));
}
// dynamic use hook props
export function getDynamicProps(props) {
  const ret = {};
  Object.keys(props).map((key) => {
    ret[key] = unref(props[key]);
  });
  return ret;
}
export function getLastItem(list) {
  if (Array.isArray(list)) {
    return list.slice(-1)[0];
  }
  if (list instanceof Set) {
    return Array.from(list).slice(-1)[0];
  }
  if (list instanceof Map) {
    return Array.from(list.values()).slice(-1)[0];
  }
}
//# sourceMappingURL=index.js.map
