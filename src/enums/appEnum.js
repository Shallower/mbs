export const SIDE_BAR_MINI_WIDTH = 48;
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80;
export var ContentEnum;
(function (ContentEnum) {
    // auto width
    ContentEnum["FULL"] = "full";
    // fixed width
    ContentEnum["FIXED"] = "fixed";
})(ContentEnum || (ContentEnum = {}));
// app current theme
export var ThemeModeEnum;
(function (ThemeModeEnum) {
    ThemeModeEnum["LIGHT"] = "light-mode";
    ThemeModeEnum["DARK"] = "dark-mode";
    ThemeModeEnum["SEMI_DARK"] = "semi-dark-mode";
})(ThemeModeEnum || (ThemeModeEnum = {}));
// menu theme enum
export var ThemeEnum;
(function (ThemeEnum) {
    ThemeEnum["DARK"] = "dark";
    ThemeEnum["LIGHT"] = "light";
})(ThemeEnum || (ThemeEnum = {}));
/**
 * 权限模式
 */
export var PermissionModeEnum;
(function (PermissionModeEnum) {
    // role
    PermissionModeEnum["ROLE"] = "ROLE";
    // black
    PermissionModeEnum["BACK"] = "BACK";
})(PermissionModeEnum || (PermissionModeEnum = {}));
//  Route switching animation
export var RouterTransitionEnum;
(function (RouterTransitionEnum) {
    RouterTransitionEnum["ZOOM_FADE"] = "zoom-fade";
    RouterTransitionEnum["ZOOM_OUT"] = "zoom-out";
    RouterTransitionEnum["FADE_SIDE"] = "fade-slide";
    RouterTransitionEnum["FADE"] = "fade";
    RouterTransitionEnum["FADE_BOTTOM"] = "fade-bottom";
    RouterTransitionEnum["FADE_SCALE"] = "fade-scale";
})(RouterTransitionEnum || (RouterTransitionEnum = {}));
//# sourceMappingURL=appEnum.js.map