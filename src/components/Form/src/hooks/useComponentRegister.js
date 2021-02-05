import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { add, del } from '../componentMap';
export function useComponentRegister(compName, comp) {
    add(compName, comp);
    tryOnUnmounted(() => {
        del(compName);
    });
}
//# sourceMappingURL=useComponentRegister.js.map