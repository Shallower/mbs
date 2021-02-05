import { defineComponent, computed, ref, unref } from 'vue';
import { Descriptions } from 'ant-design-vue';
import { CollapseContainer } from '/@/components/Container/index';
import descProps from './props';
import { isFunction } from '/@/utils/is';
import { getSlot } from '/@/utils/helper/tsxHelper';
import { cloneDeep } from 'lodash-es';
import { deepMerge } from '/@/utils';
const prefixCls = 'description';
export default defineComponent({
    name: 'Description',
    props: descProps,
    emits: ['register'],
    setup(props, { attrs, slots, emit }) {
        const propsRef = ref(null);
        // Custom title component: get title
        const getMergeProps = computed(() => {
            return {
                ...props,
                ...unref(propsRef),
            };
        });
        const getProps = computed(() => {
            const opt = {
                ...unref(getMergeProps),
                title: undefined,
            };
            return opt;
        });
        /**
         * @description: Whether to setting title
         */
        const useWrapper = computed(() => !!unref(getMergeProps).title);
        /**
         * @description: Get configuration Collapse
         */
        const getCollapseOptions = computed(() => {
            return {
                // Cannot be expanded by default
                canExpand: false,
                ...unref(getProps).collapseOptions,
            };
        });
        const getDescriptionsProps = computed(() => {
            return { ...attrs, ...unref(getProps) };
        });
        /**
         * @description:设置desc
         */
        function setDescProps(descProps) {
            // Keep the last setDrawerProps
            const mergeProps = deepMerge(unref(propsRef) || {}, descProps);
            propsRef.value = cloneDeep(mergeProps);
        }
        // Prevent line breaks
        function renderLabel({ label, labelMinWidth, labelStyle }) {
            if (!labelStyle && !labelMinWidth) {
                return label;
            }
            const labelStyles = {
                ...labelStyle,
                minWidth: `${labelMinWidth}px `,
            };
            return <div style={labelStyles}>{label}</div>;
        }
        function renderItem() {
            const { schema } = unref(getProps);
            return unref(schema).map((item) => {
                const { render, field, span, show, contentMinWidth } = item;
                const { data } = unref(getProps);
                if (show && isFunction(show) && !show(data)) {
                    return null;
                }
                const getContent = () => isFunction(render) ? render(data?.[field], data) : unref(data) && unref(data)[field];
                const width = contentMinWidth;
                return (<Descriptions.Item label={renderLabel(item)} key={field} span={span}>
            {() => {
                    if (!contentMinWidth) {
                        return getContent();
                    }
                    const style = {
                        minWidth: `${width}px`,
                    };
                    return <div style={style}>{getContent()}</div>;
                }}
          </Descriptions.Item>);
            });
        }
        const renderDesc = () => {
            return (<Descriptions class={`${prefixCls}`} {...unref(getDescriptionsProps)}>
          {renderItem()}
        </Descriptions>);
        };
        const renderContainer = () => {
            const content = props.useCollapse ? renderDesc() : <div>{renderDesc()}</div>;
            // Reduce the dom level
            if (!props.useCollapse) {
                return content;
            }
            const { canExpand, helpMessage } = unref(getCollapseOptions);
            const { title } = unref(getMergeProps);
            return (<CollapseContainer title={title} canExpan={canExpand} helpMessage={helpMessage}>
          {{
                default: () => content,
                action: () => getSlot(slots, 'action'),
            }}
        </CollapseContainer>);
        };
        const methods = {
            setDescProps,
        };
        emit('register', methods);
        return () => (unref(useWrapper) ? renderContainer() : renderDesc());
    },
});
//# sourceMappingURL=index.jsx.map