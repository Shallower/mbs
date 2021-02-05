import { PageEnum } from '/@/enums/pageEnum';
import { isString } from '/@/utils/is';
import { unref } from 'vue';
import router from '/@/router';
function handleError(e) {
    console.error(e);
}
// page switch
export function useGo() {
    const { push, replace } = router;
    function go(opt = PageEnum.BASE_HOME, isReplace = false) {
        if (!opt)
            return;
        if (isString(opt)) {
            isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
        }
        else {
            const o = opt;
            isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
        }
    }
    return go;
}
/**
 * @description: redo current page
 */
export const useRedo = () => {
    const { push, currentRoute } = router;
    const { query, params } = currentRoute.value;
    function redo() {
        return new Promise((resolve) => {
            push({
                path: '/redirect' + unref(currentRoute).fullPath,
                query,
                params,
            }).then(() => resolve(true));
        });
    }
    return redo;
};
//# sourceMappingURL=usePage.js.map