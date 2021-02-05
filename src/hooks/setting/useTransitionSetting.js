import { computed, unref } from 'vue';
import { appStore } from '/@/store/modules/app';
const getTransitionSetting = computed(() => appStore.getProjectConfig.transitionSetting);
const getEnableTransition = computed(() => unref(getTransitionSetting)?.enable);
const getOpenNProgress = computed(() => unref(getTransitionSetting)?.openNProgress);
const getOpenPageLoading = computed(() => {
    return !!unref(getTransitionSetting)?.openPageLoading;
});
const getBasicTransition = computed(() => unref(getTransitionSetting)?.basicTransition);
function setTransitionSetting(transitionSetting) {
    appStore.commitProjectConfigState({ transitionSetting });
}
export function useTransitionSetting() {
    return {
        setTransitionSetting,
        getTransitionSetting,
        getEnableTransition,
        getOpenNProgress,
        getOpenPageLoading,
        getBasicTransition,
    };
}
//# sourceMappingURL=useTransitionSetting.js.map