import getProjectSetting from '/@/settings/projectSetting';
import { getShortName } from '../../../build/getShortName';
import { warn } from '/@/utils/log';
import { getGlobEnvConfig, isDevMode } from '/@/utils/env';
const reg = /[a-zA-Z\_]*/;
const ENV_NAME = getShortName(import.meta.env);
const ENV = (isDevMode()
    ? getGlobEnvConfig()
    : window[ENV_NAME]);
const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_APP_SHORT_NAME, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL, } = ENV;
if (!reg.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(`VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`);
}
export const useGlobSetting = () => {
    // Take global configuration
    const glob = {
        title: VITE_GLOB_APP_TITLE,
        apiUrl: VITE_GLOB_API_URL,
        shortName: VITE_GLOB_APP_SHORT_NAME,
        urlPrefix: VITE_GLOB_API_URL_PREFIX,
        uploadUrl: VITE_GLOB_UPLOAD_URL,
    };
    return glob;
};
export const useProjectSetting = () => {
    // TODO computed
    return getProjectSetting;
};
//# sourceMappingURL=index.js.map