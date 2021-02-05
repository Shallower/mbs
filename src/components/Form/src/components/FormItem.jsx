import { defineComponent, computed, unref, toRefs } from 'vue';
import { Form, Col } from 'ant-design-vue';
import { componentMap } from '../componentMap';
import { BasicHelp } from '/@/components/Basic';
import { isBoolean, isFunction } from '/@/utils/is';
import { getSlot } from '/@/utils/helper/tsxHelper';
import { createPlaceholderMessage, setComponentRuleType } from '../helper';
import { upperFirst, cloneDeep } from 'lodash-es';
import { useItemLabelWidth } from '../hooks/useLabelWidth';
import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
    name: 'BasicFormItem',
    inheritAttrs: false,
    props: {
        schema: {
            type: Object,
            default: () => { },
        },
        formProps: {
            type: Object,
            default: {},
        },
        allDefaultValues: {
            type: Object,
            default: {},
        },
        formModel: {
            type: Object,
            default: {},
        },
        setFormModel: {
            type: Function,
            default: null,
        },
        tableAction: {
            type: Object,
        },
        formActionType: {
            type: Object,
        },
    },
    setup(props, { slots }) {
        const { t } = useI18n();
        const { schema, formProps } = toRefs(props);
        const itemLabelWidthProp = useItemLabelWidth(schema, formProps);
        const getValues = computed(() => {
            const { allDefaultValues, formModel, schema } = props;
            const { mergeDynamicData } = props.formProps;
            return {
                field: schema.field,
                model: formModel,
                values: {
                    ...mergeDynamicData,
                    ...allDefaultValues,
                    ...formModel,
                },
                schema: schema,
            };
        });
        const getComponentsProps = computed(() => {
            const { schema, tableAction, formModel, formActionType } = props;
            const { componentProps = {} } = schema;
            if (!isFunction(componentProps)) {
                return componentProps;
            }
            return componentProps({ schema, tableAction, formModel, formActionType }) ?? {};
        });
        const getDisable = computed(() => {
            const { disabled: globDisabled } = props.formProps;
            const { dynamicDisabled } = props.schema;
            const { disabled: itemDisabled = false } = unref(getComponentsProps);
            let disabled = !!globDisabled || itemDisabled;
            if (isBoolean(dynamicDisabled)) {
                disabled = dynamicDisabled;
            }
            if (isFunction(dynamicDisabled)) {
                disabled = dynamicDisabled(unref(getValues));
            }
            return disabled;
        });
        function getShow() {
            const { show, ifShow } = props.schema;
            const { showAdvancedButton } = props.formProps;
            const itemIsAdvanced = showAdvancedButton
                ? isBoolean(props.schema.isAdvanced)
                    ? props.schema.isAdvanced
                    : true
                : true;
            let isShow = true;
            let isIfShow = true;
            if (isBoolean(show)) {
                isShow = show;
            }
            if (isBoolean(ifShow)) {
                isIfShow = ifShow;
            }
            if (isFunction(show)) {
                isShow = show(unref(getValues));
            }
            if (isFunction(ifShow)) {
                isIfShow = ifShow(unref(getValues));
            }
            isShow = isShow && itemIsAdvanced;
            return { isShow, isIfShow };
        }
        function handleRules() {
            const { rules: defRules = [], component, rulesMessageJoinLabel, label, dynamicRules, required, } = props.schema;
            if (isFunction(dynamicRules)) {
                return dynamicRules(unref(getValues));
            }
            let rules = cloneDeep(defRules);
            if ((!rules || rules.length === 0) && required) {
                rules = [{ required, type: 'string' }];
            }
            const requiredRuleIndex = rules.findIndex((rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'));
            const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps;
            if (requiredRuleIndex !== -1) {
                const rule = rules[requiredRuleIndex];
                if (rule.required && component) {
                    if (!Reflect.has(rule, 'type')) {
                        rule.type = 'string';
                    }
                    const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
                        ? rulesMessageJoinLabel
                        : globalRulesMessageJoinLabel;
                    rule.message =
                        rule.message || createPlaceholderMessage(component) + `${joinLabel ? label : ''}`;
                    if (component.includes('Input') || component.includes('Textarea')) {
                        rule.whitespace = true;
                    }
                    setComponentRuleType(rule, component);
                }
            }
            // Maximum input length rule check
            const characterInx = rules.findIndex((val) => val.max);
            if (characterInx !== -1 && !rules[characterInx].validator) {
                rules[characterInx].message =
                    rules[characterInx].message ||
                        t('component.form.maxTip', [rules[characterInx].max]);
            }
            return rules;
        }
        function renderComponent() {
            const { renderComponentContent, component, field, changeEvent = 'change', valueField, } = props.schema;
            const isCheck = component && ['Switch', 'Checkbox'].includes(component);
            const eventKey = `on${upperFirst(changeEvent)}`;
            const on = {
                [eventKey]: (e) => {
                    if (propsData[eventKey]) {
                        propsData[eventKey](e);
                    }
                    const target = e ? e.target : null;
                    const value = target ? (isCheck ? target.checked : target.value) : e;
                    props.setFormModel(field, value);
                },
            };
            const Comp = componentMap.get(component);
            const { autoSetPlaceHolder, size } = props.formProps;
            const propsData = {
                allowClear: true,
                getPopupContainer: (trigger) => trigger.parentNode,
                size,
                ...unref(getComponentsProps),
                disabled: unref(getDisable),
            };
            const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
            let placeholder;
            // RangePicker place is an array
            if (isCreatePlaceholder && component !== 'RangePicker' && component) {
                placeholder = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component);
            }
            propsData.placeholder = placeholder;
            propsData.codeField = field;
            propsData.formValues = unref(getValues);
            const bindValue = {
                [valueField || (isCheck ? 'checked' : 'value')]: props.formModel[field],
            };
            const compAttr = {
                ...propsData,
                ...on,
                ...bindValue,
            };
            if (!renderComponentContent) {
                return <Comp {...compAttr}/>;
            }
            const compSlot = isFunction(renderComponentContent)
                ? { ...renderComponentContent(unref(getValues)) }
                : {
                    default: () => renderComponentContent,
                };
            return <Comp {...compAttr}>{compSlot}</Comp>;
        }
        function renderLabelHelpMessage() {
            const { label, helpMessage, helpComponentProps, subLabel } = props.schema;
            const renderLabel = subLabel ? (<span>
          {label} <span style="color:#00000073">{subLabel}</span>
        </span>) : (label);
            if (!helpMessage || (Array.isArray(helpMessage) && helpMessage.length === 0)) {
                return renderLabel;
            }
            return (<span>
          {renderLabel}
          <BasicHelp placement="top" class="mx-1" text={helpMessage} {...helpComponentProps}/>
        </span>);
        }
        function renderItem() {
            const { itemProps, slot, render, field, suffix } = props.schema;
            const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
            const { colon } = props.formProps;
            const getContent = () => {
                return slot
                    ? getSlot(slots, slot, unref(getValues))
                    : render
                        ? render(unref(getValues))
                        : renderComponent();
            };
            const showSuffix = !!suffix;
            const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix;
            return (<Form.Item name={field} colon={colon} class={{ 'suffix-item': showSuffix }} {...itemProps} label={renderLabelHelpMessage()} rules={handleRules()} labelCol={labelCol} wrapperCol={wrapperCol}>
          <>
            {getContent()}
            {showSuffix && <span class="suffix">{getSuffix}</span>}
          </>
        </Form.Item>);
        }
        return () => {
            const { colProps = {}, colSlot, renderColContent, component } = props.schema;
            if (!componentMap.has(component))
                return null;
            const { baseColProps = {} } = props.formProps;
            const realColProps = { ...baseColProps, ...colProps };
            const { isIfShow, isShow } = getShow();
            const getContent = () => {
                return colSlot
                    ? getSlot(slots, colSlot, unref(getValues))
                    : renderColContent
                        ? renderColContent(unref(getValues))
                        : renderItem();
            };
            return (isIfShow && (<Col {...realColProps} class={{ hidden: !isShow }}>
            {getContent()}
          </Col>));
        };
    },
});
//# sourceMappingURL=FormItem.jsx.map