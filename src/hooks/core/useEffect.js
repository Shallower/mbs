import { watch } from 'vue';
import { isFunction } from '/@/utils/is';
export function useEffect(effectHandler, dependencies) {
    return watch(dependencies, (changedDependencies, prevDependencies, onCleanUp) => {
        const effectCleaner = effectHandler(changedDependencies, prevDependencies);
        if (isFunction(effectCleaner)) {
            onCleanUp(effectCleaner);
        }
    }, { immediate: true, deep: true });
}
//# sourceMappingURL=useEffect.js.map