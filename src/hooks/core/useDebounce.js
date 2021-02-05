import { 
// throttle,
useThrottle, } from './useThrottle';
/**
 * @description: Applicable in components
 */
export function useDebounce(handle, wait, options = {}) {
    return useThrottle(handle, wait, Object.assign(options, {
        debounce: true,
    }));
}
//# sourceMappingURL=useDebounce.js.map