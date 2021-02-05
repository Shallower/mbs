import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component) {
    if (component.includes('Input')) {
        return t('common.inputText');
    }
    if (component.includes('Picker')) {
        return t('common.chooseText');
    }
    if (component.includes('Select') ||
        component.includes('Checkbox') ||
        component.includes('Radio') ||
        component.includes('Switch')) {
        return t('common.chooseText');
    }
    return '';
}
//# sourceMappingURL=helper.js.map