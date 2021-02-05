import { ContentEnum, RouterTransitionEnum } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TopMenuAlignEnum, TriggerEnum, MixSidebarTriggerEnum, } from '/@/enums/menuEnum';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export var HandlerEnum;
(function (HandlerEnum) {
    HandlerEnum[HandlerEnum["CHANGE_LAYOUT"] = 0] = "CHANGE_LAYOUT";
    // menu
    HandlerEnum[HandlerEnum["MENU_HAS_DRAG"] = 1] = "MENU_HAS_DRAG";
    HandlerEnum[HandlerEnum["MENU_ACCORDION"] = 2] = "MENU_ACCORDION";
    HandlerEnum[HandlerEnum["MENU_TRIGGER"] = 3] = "MENU_TRIGGER";
    HandlerEnum[HandlerEnum["MENU_TOP_ALIGN"] = 4] = "MENU_TOP_ALIGN";
    HandlerEnum[HandlerEnum["MENU_COLLAPSED"] = 5] = "MENU_COLLAPSED";
    HandlerEnum[HandlerEnum["MENU_COLLAPSED_SHOW_TITLE"] = 6] = "MENU_COLLAPSED_SHOW_TITLE";
    HandlerEnum[HandlerEnum["MENU_WIDTH"] = 7] = "MENU_WIDTH";
    HandlerEnum[HandlerEnum["MENU_SHOW_SIDEBAR"] = 8] = "MENU_SHOW_SIDEBAR";
    HandlerEnum[HandlerEnum["MENU_THEME"] = 9] = "MENU_THEME";
    HandlerEnum[HandlerEnum["MENU_SPLIT"] = 10] = "MENU_SPLIT";
    HandlerEnum[HandlerEnum["MENU_FIXED"] = 11] = "MENU_FIXED";
    HandlerEnum[HandlerEnum["MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE"] = 12] = "MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE";
    HandlerEnum[HandlerEnum["MENU_TRIGGER_MIX_SIDEBAR"] = 13] = "MENU_TRIGGER_MIX_SIDEBAR";
    HandlerEnum[HandlerEnum["MENU_FIXED_MIX_SIDEBAR"] = 14] = "MENU_FIXED_MIX_SIDEBAR";
    // header
    HandlerEnum[HandlerEnum["HEADER_SHOW"] = 15] = "HEADER_SHOW";
    HandlerEnum[HandlerEnum["HEADER_THEME"] = 16] = "HEADER_THEME";
    HandlerEnum[HandlerEnum["HEADER_FIXED"] = 17] = "HEADER_FIXED";
    HandlerEnum[HandlerEnum["HEADER_SEARCH"] = 18] = "HEADER_SEARCH";
    HandlerEnum[HandlerEnum["TABS_SHOW_QUICK"] = 19] = "TABS_SHOW_QUICK";
    HandlerEnum[HandlerEnum["TABS_SHOW_REDO"] = 20] = "TABS_SHOW_REDO";
    HandlerEnum[HandlerEnum["TABS_SHOW"] = 21] = "TABS_SHOW";
    HandlerEnum[HandlerEnum["TABS_SHOW_FOLD"] = 22] = "TABS_SHOW_FOLD";
    HandlerEnum[HandlerEnum["LOCK_TIME"] = 23] = "LOCK_TIME";
    HandlerEnum[HandlerEnum["FULL_CONTENT"] = 24] = "FULL_CONTENT";
    HandlerEnum[HandlerEnum["CONTENT_MODE"] = 25] = "CONTENT_MODE";
    HandlerEnum[HandlerEnum["SHOW_BREADCRUMB"] = 26] = "SHOW_BREADCRUMB";
    HandlerEnum[HandlerEnum["SHOW_BREADCRUMB_ICON"] = 27] = "SHOW_BREADCRUMB_ICON";
    HandlerEnum[HandlerEnum["GRAY_MODE"] = 28] = "GRAY_MODE";
    HandlerEnum[HandlerEnum["COLOR_WEAK"] = 29] = "COLOR_WEAK";
    HandlerEnum[HandlerEnum["SHOW_LOGO"] = 30] = "SHOW_LOGO";
    HandlerEnum[HandlerEnum["SHOW_FOOTER"] = 31] = "SHOW_FOOTER";
    HandlerEnum[HandlerEnum["ROUTER_TRANSITION"] = 32] = "ROUTER_TRANSITION";
    HandlerEnum[HandlerEnum["OPEN_PROGRESS"] = 33] = "OPEN_PROGRESS";
    HandlerEnum[HandlerEnum["OPEN_PAGE_LOADING"] = 34] = "OPEN_PAGE_LOADING";
    HandlerEnum[HandlerEnum["OPEN_ROUTE_TRANSITION"] = 35] = "OPEN_ROUTE_TRANSITION";
})(HandlerEnum || (HandlerEnum = {}));
export const contentModeOptions = [
    {
        value: ContentEnum.FULL,
        label: t('layout.setting.contentModeFull'),
    },
    {
        value: ContentEnum.FIXED,
        label: t('layout.setting.contentModeFixed'),
    },
];
export const topMenuAlignOptions = [
    {
        value: TopMenuAlignEnum.CENTER,
        label: t('layout.setting.topMenuAlignRight'),
    },
    {
        value: TopMenuAlignEnum.START,
        label: t('layout.setting.topMenuAlignLeft'),
    },
    {
        value: TopMenuAlignEnum.END,
        label: t('layout.setting.topMenuAlignCenter'),
    },
];
export const getMenuTriggerOptions = (hideTop) => {
    return [
        {
            value: TriggerEnum.NONE,
            label: t('layout.setting.menuTriggerNone'),
        },
        {
            value: TriggerEnum.FOOTER,
            label: t('layout.setting.menuTriggerBottom'),
        },
        ...(hideTop
            ? []
            : [
                {
                    value: TriggerEnum.HEADER,
                    label: t('layout.setting.menuTriggerTop'),
                },
            ]),
    ];
};
export const routerTransitionOptions = [
    RouterTransitionEnum.ZOOM_FADE,
    RouterTransitionEnum.FADE,
    RouterTransitionEnum.ZOOM_OUT,
    RouterTransitionEnum.FADE_SIDE,
    RouterTransitionEnum.FADE_BOTTOM,
    RouterTransitionEnum.FADE_SCALE,
].map((item) => {
    return {
        label: item,
        value: item,
    };
});
export const menuTypeList = [
    {
        title: t('layout.setting.menuTypeSidebar'),
        mode: MenuModeEnum.INLINE,
        type: MenuTypeEnum.SIDEBAR,
    },
    {
        title: t('layout.setting.menuTypeMix'),
        mode: MenuModeEnum.INLINE,
        type: MenuTypeEnum.MIX,
    },
    {
        title: t('layout.setting.menuTypeTopMenu'),
        mode: MenuModeEnum.HORIZONTAL,
        type: MenuTypeEnum.TOP_MENU,
    },
    {
        title: t('layout.setting.menuTypeMixSidebar'),
        mode: MenuModeEnum.INLINE,
        type: MenuTypeEnum.MIX_SIDEBAR,
    },
];
export const mixSidebarTriggerOptions = [
    {
        value: MixSidebarTriggerEnum.HOVER,
        label: t('layout.setting.triggerHover'),
    },
    {
        value: MixSidebarTriggerEnum.CLICK,
        label: t('layout.setting.triggerClick'),
    },
];
//# sourceMappingURL=enum.js.map