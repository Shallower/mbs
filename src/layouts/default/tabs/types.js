export var TabContentEnum;
(function (TabContentEnum) {
    TabContentEnum[TabContentEnum["TAB_TYPE"] = 0] = "TAB_TYPE";
    TabContentEnum[TabContentEnum["EXTRA_TYPE"] = 1] = "EXTRA_TYPE";
})(TabContentEnum || (TabContentEnum = {}));
/**
 * @description: 右键：下拉菜单文字
 */
export var MenuEventEnum;
(function (MenuEventEnum) {
    // 刷新
    MenuEventEnum[MenuEventEnum["REFRESH_PAGE"] = 0] = "REFRESH_PAGE";
    // 关闭当前
    MenuEventEnum[MenuEventEnum["CLOSE_CURRENT"] = 1] = "CLOSE_CURRENT";
    // 关闭左侧
    MenuEventEnum[MenuEventEnum["CLOSE_LEFT"] = 2] = "CLOSE_LEFT";
    // 关闭右侧
    MenuEventEnum[MenuEventEnum["CLOSE_RIGHT"] = 3] = "CLOSE_RIGHT";
    // 关闭其他
    MenuEventEnum[MenuEventEnum["CLOSE_OTHER"] = 4] = "CLOSE_OTHER";
    // 关闭所有
    MenuEventEnum[MenuEventEnum["CLOSE_ALL"] = 5] = "CLOSE_ALL";
    // 放大
    MenuEventEnum[MenuEventEnum["SCALE"] = 6] = "SCALE";
})(MenuEventEnum || (MenuEventEnum = {}));
//# sourceMappingURL=types.js.map