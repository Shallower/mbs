const getGlobal = () => (typeof window !== 'undefined' ? window : global);
export const getTinymce = () => {
    const global = getGlobal();
    return global && global.tinymce ? global.tinymce : null;
};
//# sourceMappingURL=getTinymce.js.map