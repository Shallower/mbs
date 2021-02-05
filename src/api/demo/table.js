import { defHttp } from '/@/utils/http/axios';
var Api;
(function (Api) {
    Api["DEMO_LIST"] = "/table/getDemoList";
})(Api || (Api = {}));
/**
 * @description: Get sample list value
 */
export function demoListApi(params) {
    return defHttp.request({
        url: Api.DEMO_LIST,
        method: 'GET',
        params,
        headers: {
            ignoreCancelToken: true,
        },
    });
}
//# sourceMappingURL=table.js.map