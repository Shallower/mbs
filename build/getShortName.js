/**
 * Get the configuration file variable name
 * @param env
 */
export const getShortName = (env) => {
    return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
        .toUpperCase()
        .replace(/\s/g, '');
};
//# sourceMappingURL=getShortName.js.map