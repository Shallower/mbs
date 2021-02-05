import { useDebounce } from '/@/hooks/core/useDebounce';
import { addResizeListener, removeResizeListener } from '/@/utils/event/resizeEvent';
export function useElResize(el, fn, wait = 100, options) {
    let handler = () => {
        fn();
    };
    const [handleSize, cancel] = useDebounce(handler, wait, options);
    handler = wait ? handleSize : handler;
    function start() {
        addResizeListener(el, handler);
    }
    function stop() {
        removeResizeListener(el, handler);
        cancel();
    }
    return [start, stop];
}
//# sourceMappingURL=useElResize.js.map