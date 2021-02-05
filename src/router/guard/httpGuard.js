import { useProjectSetting } from '/@/hooks/setting';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
export function createHttpGuard(router) {
    const { removeAllHttpPending } = useProjectSetting();
    let axiosCanceler;
    if (removeAllHttpPending) {
        axiosCanceler = new AxiosCanceler();
    }
    router.beforeEach(async () => {
        // Switching the route will delete the previous request
        removeAllHttpPending && axiosCanceler?.removeAllPending();
        return true;
    });
}
//# sourceMappingURL=httpGuard.js.map