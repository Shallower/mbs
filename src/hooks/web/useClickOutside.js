import { ref, unref } from 'vue';
import { useEventListener } from '/@/hooks/event/useEventListener';
import { isServer } from '/@/utils/is';
export function useClickOutside(containerRef, onClickOutside, eventName = 'click') {
    if (isServer)
        return;
    const isTouchRef = ref(false);
    useEventListener({
        el: document,
        name: 'touchend',
        listener: handler,
        options: true,
    });
    useEventListener({
        el: document,
        name: eventName,
        listener: handler,
        options: true,
    });
    function handler(e) {
        if (e.type === 'touchend') {
            isTouchRef.value = true;
        }
        if (e.type === 'click' && unref(isTouchRef))
            return;
        const el = containerRef.value;
        if (el && e.target && !el.contains(e.target)) {
            onClickOutside(e);
        }
    }
}
//# sourceMappingURL=useClickOutside.js.map