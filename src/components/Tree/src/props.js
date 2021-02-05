export const basicProps = {
    replaceFields: {
        type: Object,
    },
    treeData: {
        type: Array,
    },
    actionList: {
        type: Array,
        default: () => [],
    },
    expandedKeys: {
        type: Array,
        default: () => [],
    },
    selectedKeys: {
        type: Array,
        default: () => [],
    },
    checkedKeys: {
        type: Array,
        default: () => [],
    },
    beforeRightClick: {
        type: Function,
        default: null,
    },
    rightMenuList: {
        type: Array,
    },
};
export const treeNodeProps = {
    actionList: {
        type: Array,
        default: () => [],
    },
    replaceFields: {
        type: Object,
    },
    treeData: {
        type: Array,
        default: () => [],
    },
};
//# sourceMappingURL=props.js.map