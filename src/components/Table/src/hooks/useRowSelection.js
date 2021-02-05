import { computed, ref, unref } from 'vue';
/* eslint-disable */
export function useRowSelection(propsRef, emit) {
    const selectedRowKeysRef = ref([]);
    const selectedRowRef = ref([]);
    const getRowSelectionRef = computed(() => {
        const { rowSelection } = unref(propsRef);
        if (!rowSelection) {
            return null;
        }
        return {
            selectedRowKeys: unref(selectedRowKeysRef),
            hideDefaultSelections: false,
            onChange: (selectedRowKeys, selectedRows) => {
                selectedRowKeysRef.value = selectedRowKeys;
                selectedRowRef.value = selectedRows;
                emit('selection-change', {
                    keys: selectedRowKeys,
                    rows: selectedRows,
                });
            },
            ...rowSelection,
        };
    });
    function setSelectedRowKeys(rowKeys) {
        selectedRowKeysRef.value = rowKeys;
    }
    function clearSelectedRowKeys() {
        selectedRowRef.value = [];
        selectedRowKeysRef.value = [];
    }
    function deleteSelectRowByKey(key) {
        const selectedRowKeys = unref(selectedRowKeysRef);
        const index = selectedRowKeys.findIndex((item) => item === key);
        if (index !== -1) {
            unref(selectedRowKeysRef).splice(index, 1);
        }
    }
    function getSelectRowKeys() {
        return unref(selectedRowKeysRef);
    }
    function getSelectRows() {
        // const ret = toRaw(unref(selectedRowRef)).map((item) => toRaw(item));
        return unref(selectedRowRef);
    }
    function getRowSelection() {
        return unref(getRowSelectionRef);
    }
    return {
        getRowSelection,
        getRowSelectionRef,
        getSelectRows,
        getSelectRowKeys,
        setSelectedRowKeys,
        clearSelectedRowKeys,
        deleteSelectRowByKey,
    };
}
//# sourceMappingURL=useRowSelection.js.map