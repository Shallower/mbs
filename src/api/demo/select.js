import { defHttp } from '/@/utils/http/axios';
var Api;
(function (Api) {
    Api["OPTIONS_LIST"] = "/select/getDemoOptions";
})(Api || (Api = {}));
/**
 * @description: Get sample options value
 */
export function optionsListApi() {
    return defHttp.request({
        url: Api.OPTIONS_LIST,
        method: 'GET',
    });
}
//# sourceMappingURL=select.js.map