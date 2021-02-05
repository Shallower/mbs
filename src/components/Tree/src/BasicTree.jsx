import './index.less';
import { defineComponent, reactive, computed, unref, ref, watchEffect } from 'vue';
import { Tree } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { useContextMenu } from '/@/hooks/web/useContextMenu';
import { isFunction } from '/@/utils/is';
import { omit } from 'lodash-es';
import { extendSlots } from '/@/utils/helper/tsxHelper';
import { basicProps } from './props';
import { useTree } from './useTree';
import { useExpose } from '/@/hooks/core/useExpose';
import { onMounted } from 'vue';
const prefixCls = 'basic-tree';
export default defineComponent({
    name: 'BasicTree',
    props: basicProps,
    emits: ['update:expandedKeys', 'update:selectedKeys', 'update:value', 'get'],
    setup(props, { attrs, slots, emit }) {
        const state = reactive({
            expandedKeys: props.expandedKeys || [],
            selectedKeys: props.selectedKeys || [],
            checkedKeys: props.checkedKeys || [],
        });
        const treeDataRef = ref([]);
        const [createContextMenu] = useContextMenu();
        const getReplaceFields = computed(() => {
            const { replaceFields } = props;
            return {
                children: 'children',
                title: 'title',
                key: 'key',
                ...replaceFields,
            };
        });
        const getContentStyle = computed(() => {
            const { actionList } = props;
            const width = actionList.length * 18;
            return {
                width: `calc(100% - ${width}px)`,
            };
        });
        const getBindValues = computed(() => {
            let propsData = {
                blockNode: true,
                ...attrs,
                ...props,
                expandedKeys: state.expandedKeys,
                selectedKeys: state.selectedKeys,
                checkedKeys: state.checkedKeys,
                replaceFields: unref(getReplaceFields),
                'onUpdate:expandedKeys': (v) => {
                    state.expandedKeys = v;
                    emit('update:expandedKeys', v);
                },
                'onUpdate:selectedKeys': (v) => {
                    state.selectedKeys = v;
                    emit('update:selectedKeys', v);
                },
                onCheck: (v) => {
                    state.checkedKeys = v;
                    emit('update:value', v);
                },
                onRightClick: handleRightClick,
            };
            propsData = omit(propsData, 'treeData');
            return propsData;
        });
        const getTreeData = computed(() => unref(treeDataRef));
        const { deleteNodeByKey, insertNodeByKey, filterByLevel, updateNodeByKey } = useTree(treeDataRef, getReplaceFields);
        //  渲染操作按钮
        function renderAction(node) {
            const { actionList } = props;
            if (!actionList || actionList.length === 0)
                return;
            return actionList.map((item, index) => {
                return (<span key={index} class={`${prefixCls}__action`}>
            {item.render(node)}
          </span>);
            });
        }
        // 渲染树节点
        function renderTreeNode({ data }) {
            if (!data) {
                return null;
            }
            return data.map((item) => {
                const { title: titleField, key: keyField, children: childrenField } = unref(getReplaceFields);
                const propsData = omit(item, 'title');
                const anyItem = item;
                return (<Tree.TreeNode {...propsData} key={anyItem?.[keyField]}>
            {{
                    title: () => (<span class={`${prefixCls}-title`}>
                  <span class={`${prefixCls}__content`} style={unref(getContentStyle)}>
                    {titleField && anyItem[titleField]}
                  </span>
                  <span class={`${prefixCls}__actions`}> {renderAction(item)}</span>
                </span>),
                    default: () => renderTreeNode({ data: childrenField ? anyItem[childrenField] : [] }),
                }}
          </Tree.TreeNode>);
            });
        }
        // 处理右键事件
        async function handleRightClick({ event, node }) {
            const { rightMenuList: menuList = [], beforeRightClick } = props;
            let rightMenuList = [];
            if (beforeRightClick && isFunction(beforeRightClick)) {
                rightMenuList = await beforeRightClick(node);
            }
            else {
                rightMenuList = menuList;
            }
            if (!rightMenuList.length)
                return;
            createContextMenu({
                event,
                items: rightMenuList,
            });
        }
        function setExpandedKeys(keys) {
            state.expandedKeys = keys;
        }
        function getExpandedKeys() {
            return state.expandedKeys;
        }
        function setSelectedKeys(keys) {
            state.selectedKeys = keys;
        }
        function getSelectedKeys() {
            return state.selectedKeys;
        }
        function setCheckedKeys(keys) {
            state.checkedKeys = keys;
        }
        function getCheckedKeys() {
            return state.checkedKeys;
        }
        watchEffect(() => {
            treeDataRef.value = props.treeData;
            state.expandedKeys = props.expandedKeys;
            state.selectedKeys = props.selectedKeys;
            state.checkedKeys = props.checkedKeys;
        });
        const instance = {
            setExpandedKeys,
            getExpandedKeys,
            setSelectedKeys,
            getSelectedKeys,
            setCheckedKeys,
            getCheckedKeys,
            insertNodeByKey,
            deleteNodeByKey,
            updateNodeByKey,
            filterByLevel: (level) => {
                state.expandedKeys = filterByLevel(level);
            },
        };
        useExpose(instance);
        onMounted(() => {
            emit('get', instance);
        });
        return () => {
            return (<Tree {...unref(getBindValues)} class={prefixCls}>
          {{
                switcherIcon: () => <DownOutlined />,
                default: () => renderTreeNode({ data: unref(getTreeData) }),
                ...extendSlots(slots),
            }}
        </Tree>);
        };
    },
});
//# sourceMappingURL=BasicTree.jsx.map