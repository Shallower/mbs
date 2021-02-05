import { createI18n } from 'vue-i18n';
import projectSetting from '/@/settings/projectSetting';
import messages from './getMessage';
const { lang, availableLocales, fallback } = projectSetting?.locale;
const localeData = {
    legacy: false,
    locale: lang,
    fallbackLocale: fallback,
    messages,
    availableLocales: availableLocales,
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
};
export let i18n;
// setup i18n instance with glob
export function setupI18n(app) {
    i18n = createI18n(localeData);
    app.use(i18n);
}
//# sourceMappingURL=setupI18n.js.map