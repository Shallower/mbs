import { watch, computed, getCurrentInstance, onMounted, onUnmounted, nextTick, reactive, } from 'vue';
import { error } from '../log';
export function explicitComputed(source, fn) {
    const v = reactive({ value: fn() });
    watch(source, () => (v.value = fn()));
    return computed(() => v.value);
}
export function tryOnMounted(fn, sync = true) {
    if (getCurrentInstance()) {
        onMounted(fn);
    }
    else if (sync) {
        fn();
    }
    else {
        nextTick(fn);
    }
}
export function tryOnUnmounted(fn) {
    getCurrentInstance() && onUnmounted(fn);
}
export function tryTsxEmit(fn) {
    const instance = getCurrentInstance();
    instance && fn.call(null, instance);
}
export function isInSetup() {
    if (!getCurrentInstance()) {
        error('Please put useForm function in the setup function!');
    }
}
//# sourceMappingURL=vueHelper.js.map