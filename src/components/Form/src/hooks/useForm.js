import { ref, onUnmounted, unref, nextTick, watchEffect } from 'vue';
import { isInSetup } from '/@/utils/helper/vueHelper';
import { isProdMode } from '/@/utils/env';
import { error } from '/@/utils/log';
import { getDynamicProps } from '/@/utils';
export function useForm(props) {
    isInSetup();
    const formRef = ref(null);
    const loadedRef = ref(false);
    async function getForm() {
        const form = unref(formRef);
        if (!form) {
            error('The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!');
        }
        await nextTick();
        return form;
    }
    function register(instance) {
        isProdMode() &&
            onUnmounted(() => {
                formRef.value = null;
                loadedRef.value = null;
            });
        if (unref(loadedRef) && isProdMode() && instance === unref(formRef))
            return;
        formRef.value = instance;
        loadedRef.value = true;
        watchEffect(() => {
            props && instance.setProps(getDynamicProps(props));
        });
    }
    const methods = {
        scrollToField: async (name, options) => {
            const form = await getForm();
            form.scrollToField(name, options);
        },
        setProps: async (formProps) => {
            const form = await getForm();
            form.setProps(formProps);
        },
        updateSchema: async (data) => {
            const form = await getForm();
            form.updateSchema(data);
        },
        clearValidate: async (name) => {
            const form = await getForm();
            form.clearValidate(name);
        },
        resetFields: async () => {
            getForm().then(async (form) => {
                await form.resetFields();
            });
        },
        removeSchemaByFiled: async (field) => {
            const form = await getForm();
            form.removeSchemaByFiled(field);
        },
        // TODO promisify
        getFieldsValue: () => {
            return unref(formRef)?.getFieldsValue();
        },
        setFieldsValue: async (values) => {
            const form = await getForm();
            form.setFieldsValue(values);
        },
        appendSchemaByField: async (schema, prefixField, first) => {
            const form = await getForm();
            form.appendSchemaByField(schema, prefixField, first);
        },
        submit: async () => {
            const form = await getForm();
            return form.submit();
        },
        validate: async (nameList) => {
            const form = await getForm();
            return form.validate(nameList);
        },
        validateFields: async (nameList) => {
            const form = await getForm();
            return form.validateFields(nameList);
        },
    };
    return [register, methods];
}
//# sourceMappingURL=useForm.js.map