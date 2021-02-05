import { defineComponent } from 'vue';
import { createVNode, render, reactive, h } from 'vue';
import Loading from './index.vue';
export function createLoading(props, target) {
    let vm = null;
    const data = reactive({
        tip: '',
        loading: true,
        ...props,
    });
    const LoadingWrap = defineComponent({
        setup() {
            return () => {
                return h(Loading, { ...data });
            };
        },
    });
    vm = createVNode(LoadingWrap);
    render(vm, document.createElement('div'));
    function close() {
        if (vm?.el && vm.el.parentNode) {
            vm.el.parentNode.removeChild(vm.el);
        }
    }
    function open(target = document.body) {
        if (!vm || !vm.el) {
            return;
        }
        target.appendChild(vm.el);
    }
    if (target) {
        open(target);
    }
    return {
        vm,
        close,
        open,
        setTip: (tip) => {
            data.tip = tip;
        },
        setLoading: (loading) => {
            data.loading = loading;
        },
        get loading() {
            return data.loading;
        },
        get $el() {
            return vm?.el;
        },
    };
}
//# sourceMappingURL=createLoading.js.map