import { isObject } from '@vue/shared';
import { reactive, ref, readonly } from 'vue';
import { isFunction } from '/@/utils/is';
export function useState(initialState) {
    if (isFunction(initialState)) {
        initialState = initialState();
    }
    if (isObject(initialState)) {
        const state = reactive({ data: initialState });
        const setState = (newState) => {
            state.data = newState;
        };
        return [readonly(state), setState];
    }
    else {
        const state = ref(initialState);
        const setState = (newState) => {
            state.value = newState;
        };
        return [readonly(state), setState];
    }
}
//# sourceMappingURL=useState.js.map