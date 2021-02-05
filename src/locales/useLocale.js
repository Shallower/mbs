import { unref, ref } from 'vue';
import { useLocaleSetting } from '/@/hooks/setting/useLocaleSetting';
import { i18n } from './setupI18n';
import 'moment/dist/locale/zh-cn';
const antConfigLocaleRef = ref(null);
export function useLocale() {
    const { getLang, getLocale, setLocale: setLocalSetting } = useLocaleSetting();
    // Switching the language will change the locale of useI18n
    // And submit to configuration modification
    function changeLocale(lang) {
        if (i18n.mode === 'legacy') {
            i18n.global.locale = lang;
        }
        else {
            i18n.global.locale.value = lang;
        }
        setLocalSetting({ lang });
        // i18n.global.setLocaleMessage(locale, messages);
        switch (lang) {
            // Simplified Chinese
            case 'zh_CN':
                import('ant-design-vue/es/locale/zh_CN').then((locale) => {
                    antConfigLocaleRef.value = locale.default;
                });
                break;
            // English
            case 'en':
                import('ant-design-vue/es/locale/en_US').then((locale) => {
                    antConfigLocaleRef.value = locale.default;
                });
                break;
            // other
            default:
                break;
        }
    }
    // initialization
    function setLocale() {
        const lang = unref(getLang);
        lang && changeLocale(lang);
    }
    return {
        setLocale,
        getLocale,
        getLang,
        changeLocale,
        antConfigLocale: antConfigLocaleRef,
    };
}
//# sourceMappingURL=useLocale.js.map