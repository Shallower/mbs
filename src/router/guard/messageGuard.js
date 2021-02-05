import { useProjectSetting } from '/@/hooks/setting';
import { Modal, notification } from 'ant-design-vue';
import { warn } from '/@/utils/log';
export function createMessageGuard(router) {
    const { closeMessageOnSwitch } = useProjectSetting();
    router.beforeEach(async () => {
        try {
            if (closeMessageOnSwitch) {
                Modal.destroyAll();
                notification.destroy();
            }
        }
        catch (error) {
            warn('message guard error:' + error);
        }
        return true;
    });
}
//# sourceMappingURL=messageGuard.js.map