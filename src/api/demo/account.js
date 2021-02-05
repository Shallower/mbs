import { defHttp } from '/@/utils/http/axios';
var Api;
(function (Api) {
    Api["ACCOUNT_INFO"] = "/account/getAccountInfo";
})(Api || (Api = {}));
// Get personal center-basic settings
export function accountInfoApi() {
    return defHttp.request({
        url: Api.ACCOUNT_INFO,
        method: 'GET',
    });
}
//# sourceMappingURL=account.js.map