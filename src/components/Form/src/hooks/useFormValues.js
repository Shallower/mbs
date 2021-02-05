import { isArray, isFunction, isObject, isString, isNullOrUnDef } from '/@/utils/is';
import { dateUtil } from '/@/utils/dateUtil';
import { unref, nextTick } from 'vue';
import { useModalContext } from '/@/components/Modal';
export function useFormValues({ transformDateFuncRef, fieldMapToTimeRef, defaultValueRef, getSchema, formModel, }) {
    const modalFn = useModalContext();
    // Processing form values
    function handleFormValues(values) {
        if (!isObject(values)) {
            return {};
        }
        const res = {};
        for (const item of Object.entries(values)) {
            let [, value] = item;
            const [key] = item;
            if ((isArray(value) && value.length === 0) || isFunction(value)) {
                continue;
            }
            const transformDateFunc = unref(transformDateFuncRef);
            if (isObject(value)) {
                value = transformDateFunc(value);
            }
            if (isArray(value) && value[0]._isAMomentObject && value[1]._isAMomentObject) {
                value = value.map((item) => transformDateFunc(item));
            }
            // Remove spaces
            if (isString(value)) {
                value = value.trim();
            }
            res[key] = value;
        }
        return handleRangeTimeValue(res);
    }
    /**
     * @description: Processing time interval parameters
     */
    function handleRangeTimeValue(values) {
        const fieldMapToTime = unref(fieldMapToTimeRef);
        if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
            return values;
        }
        for (const [field, [startTimeKey, endTimeKey, format = 'YYYY-MM-DD']] of fieldMapToTime) {
            if (!field || !startTimeKey || !endTimeKey || !values[field]) {
                continue;
            }
            const [startTime, endTime] = values[field];
            values[startTimeKey] = dateUtil(startTime).format(format);
            values[endTimeKey] = dateUtil(endTime).format(format);
            Reflect.deleteProperty(values, field);
        }
        return values;
    }
    function initDefault() {
        const schemas = unref(getSchema);
        const obj = {};
        schemas.forEach((item) => {
            const { defaultValue } = item;
            if (!isNullOrUnDef(defaultValue)) {
                obj[item.field] = defaultValue;
                formModel[item.field] = defaultValue;
            }
        });
        defaultValueRef.value = obj;
        nextTick(() => {
            //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
            modalFn?.redoModalHeight?.();
        });
    }
    return { handleFormValues, initDefault };
}
//# sourceMappingURL=useFormValues.js.map