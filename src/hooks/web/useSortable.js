import Sortable from 'sortablejs';
import { nextTick, unref } from 'vue';
export function useSortable(el, options) {
    function initSortable() {
        nextTick(() => {
            if (!el)
                return;
            Sortable.create(unref(el), {
                animation: 500,
                delay: 400,
                delayOnTouchOnly: true,
                ...options,
            });
        });
    }
    return { initSortable };
}
//# sourceMappingURL=useSortable.js.map