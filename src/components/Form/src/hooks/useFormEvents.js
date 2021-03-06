import { unref, toRaw } from 'vue';
import { isArray, isFunction, isObject, isString } from '/@/utils/is';
import { deepMerge, unique } from '/@/utils';
import { dateItemType, handleInputNumberValue } from '../helper';
import { dateUtil } from '/@/utils/dateUtil';
import { cloneDeep } from 'lodash-es';
import { error } from '/@/utils/log';
export function useFormEvents({ emit, getProps, formModel, getSchema, defaultValueRef, formElRef, schemaRef, handleFormValues, }) {
    async function resetFields() {
        const { resetFunc, submitOnReset } = unref(getProps);
        resetFunc && isFunction(resetFunc) && (await resetFunc());
        const formEl = unref(formElRef);
        if (!formEl)
            return;
        Object.keys(formModel).forEach((key) => {
            formModel[key] = defaultValueRef.value[key];
        });
        clearValidate();
        emit('reset', toRaw(formModel));
        submitOnReset && handleSubmit();
    }
    /**
     * @description: Set form value
     */
    async function setFieldsValue(values) {
        const fields = unref(getSchema)
            .map((item) => item.field)
            .filter(Boolean);
        const validKeys = [];
        Object.keys(values).forEach((key) => {
            const schema = unref(getSchema).find((item) => item.field === key);
            let value = values[key];
            value = handleInputNumberValue(schema?.component, value);
            // 0| '' is allow
            if (value !== undefined && value !== null && fields.includes(key)) {
                // time type
                if (itemIsDateType(key)) {
                    if (Array.isArray(value)) {
                        const arr = [];
                        for (const ele of value) {
                            arr.push(dateUtil(ele));
                        }
                        formModel[key] = arr;
                    }
                    else {
                        formModel[key] = dateUtil(value);
                    }
                }
                else {
                    formModel[key] = value;
                }
                validKeys.push(key);
            }
        });
        validateFields(validKeys);
    }
    /**
     * @description: Delete based on field name
     */
    async function removeSchemaByFiled(fields) {
        const schemaList = cloneDeep(unref(getSchema));
        if (!fields)
            return;
        let fieldList = isString(fields) ? [fields] : fields;
        if (isString(fields)) {
            fieldList = [fields];
        }
        for (const field of fieldList) {
            _removeSchemaByFiled(field, schemaList);
        }
        schemaRef.value = schemaList;
    }
    /**
     * @description: Delete based on field name
     */
    function _removeSchemaByFiled(field, schemaList) {
        if (isString(field)) {
            const index = schemaList.findIndex((schema) => schema.field === field);
            if (index !== -1) {
                schemaList.splice(index, 1);
            }
        }
    }
    /**
     * @description: Insert after a certain field, if not insert the last
     */
    async function appendSchemaByField(schema, prefixField, first = false) {
        const schemaList = cloneDeep(unref(getSchema));
        const index = schemaList.findIndex((schema) => schema.field === prefixField);
        const hasInList = schemaList.some((item) => item.field === prefixField || schema.field);
        if (!hasInList)
            return;
        if (!prefixField || index === -1 || first) {
            first ? schemaList.unshift(schema) : schemaList.push(schema);
            schemaRef.value = schemaList;
            return;
        }
        if (index !== -1) {
            schemaList.splice(index + 1, 0, schema);
        }
        schemaRef.value = schemaList;
    }
    async function updateSchema(data) {
        let updateData = [];
        if (isObject(data)) {
            updateData.push(data);
        }
        if (isArray(data)) {
            updateData = [...data];
        }
        const hasField = updateData.every((item) => Reflect.has(item, 'field') && item.field);
        if (!hasField) {
            error('All children of the form Schema array that need to be updated must contain the `field` field');
            return;
        }
        const schema = [];
        updateData.forEach((item) => {
            unref(getSchema).forEach((val) => {
                if (val.field === item.field) {
                    const newSchema = deepMerge(val, item);
                    schema.push(newSchema);
                }
                else {
                    schema.push(val);
                }
            });
        });
        schemaRef.value = unique(schema, 'field');
    }
    function getFieldsValue() {
        const formEl = unref(formElRef);
        if (!formEl)
            return {};
        return handleFormValues(toRaw(unref(formModel)));
    }
    /**
     * @description: Is it time
     */
    function itemIsDateType(key) {
        return unref(getSchema).some((item) => {
            return item.field === key ? dateItemType.includes(item.component) : false;
        });
    }
    async function validateFields(nameList) {
        return unref(formElRef)?.validateFields(nameList);
    }
    async function validate(nameList) {
        return await unref(formElRef)?.validate(nameList);
    }
    async function clearValidate(name) {
        await unref(formElRef)?.clearValidate(name);
    }
    async function scrollToField(name, options) {
        await unref(formElRef)?.scrollToField(name, options);
    }
    /**
     * @description: Form submission
     */
    async function handleSubmit(e) {
        e && e.preventDefault();
        const { submitFunc } = unref(getProps);
        if (submitFunc && isFunction(submitFunc)) {
            await submitFunc();
            return;
        }
        const formEl = unref(formElRef);
        if (!formEl)
            return;
        try {
            const values = await validate();
            const res = handleFormValues(values);
            emit('submit', res);
        }
        catch (error) { }
    }
    return {
        handleSubmit,
        clearValidate,
        validate,
        validateFields,
        getFieldsValue,
        updateSchema,
        appendSchemaByField,
        removeSchemaByFiled,
        resetFields,
        setFieldsValue,
        scrollToField,
    };
}
//# sourceMappingURL=useFormEvents.js.map