import { ref, unref } from 'vue';
export function useFullscreen(target = ref(document.documentElement), options) {
    const isFullscreenRef = ref(false);
    const el = document.documentElement;
    let RFC_METHOD_NAME = 'requestFullscreen';
    let EFS_METHOD_NAME = 'exitFullscreen';
    let FSE_PROP_NAME = 'fullscreenElement';
    if ('webkitRequestFullScreen' in el) {
        RFC_METHOD_NAME = 'webkitRequestFullScreen';
        EFS_METHOD_NAME = 'webkitExitFullscreen';
        FSE_PROP_NAME = 'webkitFullscreenElement';
    }
    else if ('msRequestFullscreen' in el) {
        RFC_METHOD_NAME = 'msRequestFullscreen';
        EFS_METHOD_NAME = 'msExitFullscreen';
        FSE_PROP_NAME = 'msFullscreenElement';
    }
    else if ('mozRequestFullScreen' in el) {
        RFC_METHOD_NAME = 'mozRequestFullScreen';
        EFS_METHOD_NAME = 'mozCancelFullScreen';
        FSE_PROP_NAME = 'mozFullScreenElement';
    }
    else if (!('requestFullscreen' in el)) {
        throw new Error('当前浏览器不支持Fullscreen API !');
    }
    function enterFullscreen() {
        isFullscreenRef.value = true;
        return unref(target)[RFC_METHOD_NAME](options);
    }
    function exitFullscreen() {
        isFullscreenRef.value = false;
        return document[EFS_METHOD_NAME]();
    }
    function isFullscreen() {
        return unref(target) === document[FSE_PROP_NAME];
    }
    async function toggleFullscreen() {
        if (!unref(target))
            return;
        if (isFullscreen()) {
            return exitFullscreen();
        }
        else {
            return enterFullscreen();
        }
    }
    return {
        // watchFullscreen,
        toggleFullscreen,
        exitFullscreen,
        isFullscreen,
        enterFullscreen,
        isFullscreenRef,
    };
}
//# sourceMappingURL=useFullScreen.js.map