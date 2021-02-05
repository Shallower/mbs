import { provide, inject, reactive, readonly as defineReadonly, defineComponent, } from 'vue';
export function createContext(context, key = Symbol(), options = {}) {
    const { readonly = true, createProvider = false, native = false } = options;
    const state = reactive(context);
    const provideData = readonly ? defineReadonly(state) : state;
    !createProvider && provide(key, native ? context : provideData);
    const Provider = createProvider
        ? defineComponent({
            name: 'Provider',
            inheritAttrs: false,
            setup(_, { slots }) {
                provide(key, provideData);
                return () => slots.default?.();
            },
        })
        : null;
    return { Provider, state };
}
export function useContext(key = Symbol(), defaultValue) {
    return inject(key, defaultValue || {});
}
//# sourceMappingURL=useContext.js.map