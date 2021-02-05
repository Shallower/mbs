import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';
export function useTabs() {
    function canIUseFn() {
        const { multiTabsSetting: { show } = {} } = appStore.getProjectConfig;
        if (!show) {
            throw new Error('The multi-tab page is currently not open, please open it in the settings！');
        }
        return !!show;
    }
    return {
        refreshPage: async () => {
            if (canIUseFn()) {
                await tabStore.commitRedoPage();
            }
        },
        closeAll: () => canIUseFn() && tabStore.closeAllTabAction(),
        closeLeft: () => canIUseFn() && tabStore.closeLeftTabAction(tabStore.getCurrentTab),
        closeRight: () => canIUseFn() && tabStore.closeRightTabAction(tabStore.getCurrentTab),
        closeOther: () => canIUseFn() && tabStore.closeOtherTabAction(tabStore.getCurrentTab),
        closeCurrent: () => canIUseFn() && tabStore.closeTabAction(tabStore.getCurrentTab),
        close: (tab) => canIUseFn() && tabStore.closeTabAction(tab || tabStore.getCurrentTab),
    };
}
//# sourceMappingURL=useTabs.js.map