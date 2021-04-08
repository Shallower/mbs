/**
 * Application configuration
 */
import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { getLocal } from '/@/utils/helper/persistent';
import {
  updateGrayMode,
  updateColorWeak,
  updateHeaderBgColor,
  updateSidebarBgColor,
} from '/@/logics/theme';
import { appStore } from '/@/store/modules/app';
import { deepMerge } from '/@/utils';
// Initial project configuration
export function initAppConfigStore() {
  let projCfg = getLocal(PROJ_CFG_KEY);
  projCfg = deepMerge(projectSetting, projCfg || {});
  try {
    const {
      colorWeak,
      grayMode,
      headerSetting: { bgColor: headerBgColor } = {},
      menuSetting: { bgColor } = {},
    } = projCfg;
    // if (
    //   themeColor !== primaryColor &&
    //   themeColor &&
    //   process.env.VUE_APP_USE_THEME_REPLACER !== 'TRUE'
    // ) {
    //   updateTheme(themeColor);
    // }
    headerBgColor && updateHeaderBgColor(headerBgColor);
    bgColor && updateSidebarBgColor(bgColor);
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
  } catch (error) {
    console.log(error);
  }
  appStore.commitProjectConfigState(projCfg);
}
//# sourceMappingURL=initAppConfig.js.map
