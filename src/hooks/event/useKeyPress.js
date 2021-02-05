// https://ahooks.js.org/zh-CN/hooks/dom/use-key-press
import { onBeforeUnmount, onMounted, unref } from 'vue';
import { noop } from '/@/utils';
import { isFunction, isString, isNumber, isArray } from '/@/utils/is';
const defaultEvents = ['keydown'];
// 键盘事件 keyCode 别名
const aliasKeyCodeMap = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    delete: [8, 46],
};
// 键盘事件 key 别名
const aliasKeyMap = {
    esc: 'Escape',
    tab: 'Tab',
    enter: 'Enter',
    space: ' ',
    // IE11 uses key names without `Arrow` prefix for arrow keys.
    up: ['Up', 'ArrowUp'],
    left: ['Left', 'ArrowLeft'],
    right: ['Right', 'ArrowRight'],
    down: ['Down', 'ArrowDown'],
    delete: ['Backspace', 'Delete'],
};
// 修饰键
const modifierKey = {
    ctrl: (event) => event.ctrlKey,
    shift: (event) => event.shiftKey,
    alt: (event) => event.altKey,
    meta: (event) => event.metaKey,
};
/**
 * 判断按键是否激活
 * @param [event: KeyboardEvent]键盘事件
 * @param [keyFilter: any] 当前键
 * @returns Boolean
 */
function genFilterKey(event, keyFilter) {
    // 浏览器自动补全 input 的时候，会触发 keyDown、keyUp 事件，但此时 event.key 等为空
    if (!event.key) {
        return false;
    }
    // 数字类型直接匹配事件的 keyCode
    if (isNumber(keyFilter)) {
        return event.keyCode === keyFilter;
    }
    // 字符串依次判断是否有组合键
    const genArr = keyFilter.split('.');
    let genLen = 0;
    for (const key of genArr) {
        // 组合键
        const genModifier = modifierKey[key];
        // key 别名
        const aliasKey = aliasKeyMap[key];
        // keyCode 别名
        const aliasKeyCode = aliasKeyCodeMap[key];
        /**
         * 满足以上规则
         * 1. 自定义组合键别名
         * 2. 自定义 key 别名
         * 3. 自定义 keyCode 别名
         * 4. 匹配 key 或 keyCode
         */
        if ((genModifier && genModifier(event)) ||
            (aliasKey && isArray(aliasKey) ? aliasKey.includes(event.key) : aliasKey === event.key) ||
            (aliasKeyCode && isArray(aliasKeyCode)
                ? aliasKeyCode.includes(event.keyCode)
                : aliasKeyCode === event.keyCode) ||
            event.key.toUpperCase() === key.toUpperCase()) {
            genLen++;
        }
    }
    return genLen === genArr.length;
}
/**
 * 键盘输入预处理方法
 */
function genKeyFormat(keyFilter) {
    if (isFunction(keyFilter)) {
        return keyFilter;
    }
    if (isString(keyFilter) || isNumber(keyFilter)) {
        return (event) => genFilterKey(event, keyFilter);
    }
    if (isArray(keyFilter)) {
        return (event) => keyFilter.some((item) => genFilterKey(event, item));
    }
    return keyFilter ? () => true : () => false;
}
export function useKeyPress(keyFilter, eventHandler = noop, option = {}) {
    const { events = defaultEvents, target } = option;
    let el;
    function handler(event) {
        const genGuard = genKeyFormat(keyFilter);
        if (genGuard(event)) {
            return eventHandler(event);
        }
    }
    onMounted(() => {
        el = getTargetElement(target, window);
        if (!el)
            return;
        for (const eventName of events) {
            el.addEventListener(eventName, handler);
        }
    });
    onBeforeUnmount(() => {
        if (!el)
            return;
        for (const eventName of events) {
            el.removeEventListener(eventName, handler);
        }
    });
}
export function getTargetElement(target, defaultElement) {
    if (!target) {
        return defaultElement;
    }
    let targetElement;
    if (isFunction(target)) {
        targetElement = target();
    }
    else {
        targetElement = unref(target);
    }
    return targetElement;
}
//# sourceMappingURL=useKeyPress.js.map