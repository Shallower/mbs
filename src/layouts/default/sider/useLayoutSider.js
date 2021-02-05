import { computed, unref, onMounted, nextTick, ref } from 'vue';
import { TriggerEnum } from '/@/enums/menuEnum';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDebounce } from '/@/hooks/core/useDebounce';
/**
 * Handle related operations of menu events
 */
export function useSiderEvent() {
    const initRef = ref(false);
    const brokenRef = ref(false);
    const collapseRef = ref(true);
    const { setMenuSetting, getCollapsed, getMiniWidthNumber } = useMenuSetting();
    const getCollapsedWidth = computed(() => {
        return unref(brokenRef) ? 0 : unref(getMiniWidthNumber);
    });
    function onCollapseChange(val) {
        if (initRef.value) {
            collapseRef.value = val;
            setMenuSetting({ collapsed: val });
        }
        else {
            !unref(getCollapsed) && setMenuSetting({ collapsed: val });
        }
        initRef.value = true;
    }
    function onBreakpointChange(broken) {
        brokenRef.value = broken;
    }
    return { getCollapsedWidth, onCollapseChange, onBreakpointChange };
}
/**
 * Handle related operations of menu folding
 */
export function useTrigger(getIsMobile) {
    const { getTrigger, getSplit } = useMenuSetting();
    const getShowTrigger = computed(() => {
        const trigger = unref(getTrigger);
        return (trigger !== TriggerEnum.NONE &&
            !unref(getIsMobile) &&
            (trigger === TriggerEnum.FOOTER || unref(getSplit)));
    });
    const getTriggerAttr = computed(() => {
        if (unref(getShowTrigger)) {
            return {};
        }
        return {
            trigger: null,
        };
    });
    return { getTriggerAttr, getShowTrigger };
}
/**
 * Handle menu drag and drop related operations
 * @param siderRef
 * @param dragBarRef
 */
export function useDragLine(siderRef, dragBarRef, mix = false) {
    const { getMiniWidthNumber, getCollapsed, setMenuSetting } = useMenuSetting();
    onMounted(() => {
        nextTick(() => {
            const [exec] = useDebounce(changeWrapWidth, 80);
            exec();
        });
    });
    function getEl(elRef) {
        const el = unref(elRef);
        if (!el)
            return null;
        if (Reflect.has(el, '$el')) {
            return unref(elRef)?.$el;
        }
        return unref(elRef);
    }
    function handleMouseMove(ele, wrap, clientX) {
        document.onmousemove = function (innerE) {
            let iT = ele.left + (innerE.clientX - clientX);
            innerE = innerE || window.event;
            const maxT = 800;
            const minT = unref(getMiniWidthNumber);
            iT < 0 && (iT = 0);
            iT > maxT && (iT = maxT);
            iT < minT && (iT = minT);
            ele.style.left = wrap.style.width = iT + 'px';
            return false;
        };
    }
    // Drag and drop in the menu area-release the mouse
    function removeMouseup(ele) {
        const wrap = getEl(siderRef);
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            wrap.style.transition = 'width 0.2s';
            const width = parseInt(wrap.style.width);
            if (!mix) {
                const miniWidth = unref(getMiniWidthNumber);
                if (!unref(getCollapsed)) {
                    width > miniWidth + 20
                        ? setMenuSetting({ menuWidth: width })
                        : setMenuSetting({ collapsed: true });
                }
                else {
                    width > miniWidth && setMenuSetting({ collapsed: false, menuWidth: width });
                }
            }
            else {
                setMenuSetting({ menuWidth: width });
            }
            ele.releaseCapture?.();
        };
    }
    function changeWrapWidth() {
        const ele = getEl(dragBarRef);
        if (!ele)
            return;
        const wrap = getEl(siderRef);
        if (!wrap)
            return;
        ele.onmousedown = (e) => {
            wrap.style.transition = 'unset';
            const clientX = e?.clientX;
            ele.left = ele.offsetLeft;
            handleMouseMove(ele, wrap, clientX);
            removeMouseup(ele);
            ele.setCapture?.();
            return false;
        };
    }
    return {};
}
//# sourceMappingURL=useLayoutSider.js.map