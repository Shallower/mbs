import { ref, onMounted, nextTick } from 'vue';
import { useRect } from '/@/hooks/web/useRect';
export const useHeight = (element) => {
    const height = ref();
    onMounted(() => {
        nextTick(() => {
            height.value = useRect(element).height;
        });
    });
    return height;
};
//# sourceMappingURL=useHeight.js.map