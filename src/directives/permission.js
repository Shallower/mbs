import { appStore } from '/@/store/modules/app';
import { usePermission } from '/@/hooks/web/usePermission';
import { PermissionModeEnum } from '/@/enums/appEnum';
const { hasPermission } = usePermission();
function isAuth(el, binding) {
    const value = binding.value;
    if (!value)
        return;
    if (!hasPermission(value)) {
        el.parentNode?.removeChild(el);
    }
}
function isBackMode() {
    return appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK;
}
const mounted = (el, binding) => {
    if (isBackMode())
        return;
    isAuth(el, binding);
};
const updated = (el, binding) => {
    if (!isBackMode())
        return;
    isAuth(el, binding);
};
const authDirective = {
    mounted,
    updated,
};
export function setupPermissionDirective(app) {
    app.directive('auth', authDirective);
}
export default authDirective;
//# sourceMappingURL=permission.js.map