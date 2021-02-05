import { propTypes } from '/@/utils/propTypes';
export const basicProps = {
    options: {
        type: Object,
        default: {},
    },
    value: propTypes.string,
    modelValue: propTypes.string,
    // 高度
    height: {
        type: [Number, String],
        required: false,
        default: 400,
    },
    // 宽度
    width: {
        type: [Number, String],
        required: false,
        default: 'auto',
    },
    showImageUpload: propTypes.bool.def(true),
};
//# sourceMappingURL=props.js.map