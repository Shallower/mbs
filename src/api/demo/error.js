import { defHttp } from '/@/utils/http/axios';
var Api;
(function (Api) {
    // The address does not exist
    Api["Error"] = "/error";
})(Api || (Api = {}));
/**
 * @description: Trigger ajax error
 */
export function fireErrorApi() {
    return defHttp.request({
        url: Api.Error,
        method: 'GET',
    });
}
//# sourceMappingURL=error.js.map