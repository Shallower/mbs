import { computed, unref } from 'vue';
import { appStore } from '/@/store/modules/app';
import getProjectSetting from '/@/settings/projectSetting';
import { localeList } from '/@/locales/constant';
// Get locale configuration
const getLocale = computed(() => appStore.getProjectConfig.locale || getProjectSetting.locale);
// get current language
const getLang = computed(() => unref(getLocale).lang);
// get Available Locales
const getAvailableLocales = computed(() => unref(getLocale).availableLocales);
// get Fallback Locales
const getFallbackLocale = computed(() => unref(getLocale).fallback);
const getShowLocale = computed(() => unref(getLocale).show);
// Set locale configuration
function setLocale(locale) {
    appStore.commitProjectConfigState({ locale });
}
export function useLocaleSetting() {
    return {
        getLocale,
        getLang,
        localeList,
        setLocale,
        getShowLocale,
        getAvailableLocales,
        getFallbackLocale,
    };
}
//# sourceMappingURL=useLocaleSetting.js.map