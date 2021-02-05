import { defHttp } from '/@/utils/http/axios';
var Api;
(function (Api) {
    Api["GetMenuListById"] = "/getMenuListById";
})(Api || (Api = {}));
/**
 * @description: Get user menu based on id
 */
export function getMenuListById(params) {
    return defHttp.request({
        url: Api.GetMenuListById,
        method: 'GET',
        params,
    });
}
//# sourceMappingURL=menu.js.map