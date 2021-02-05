import { ref, watch, unref } from 'vue';
import { useDebounce } from '/@/hooks/core/useDebounce';
import { useThrottle } from '/@/hooks/core/useThrottle';
export function useEventListener({ el = window, name, listener, options, autoRemove = true, isDebounce = true, wait = 80, }) {
    /* eslint-disable-next-line */
    let remove = () => { };
    const isAddRef = ref(false);
    if (el) {
        const element = ref(el);
        const [handler] = isDebounce ? useDebounce(listener, wait) : useThrottle(listener, wait);
        const realHandler = wait ? handler : listener;
        const removeEventListener = (e) => {
            isAddRef.value = true;
            e.removeEventListener(name, realHandler, options);
        };
        const addEventListener = (e) => e.addEventListener(name, realHandler, options);
        const removeWatch = watch(element, (v, _ov, cleanUp) => {
            if (v) {
                !unref(isAddRef) && addEventListener(v);
                cleanUp(() => {
                    autoRemove && removeEventListener(v);
                });
            }
        }, { immediate: true });
        remove = () => {
            removeEventListener(element.value);
            removeWatch();
        };
    }
    return { removeEvent: remove };
}
//# sourceMappingURL=useEventListener.js.map