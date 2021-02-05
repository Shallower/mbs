import { defHttp } from '/@/utils/http/axios';
var Api;
(function (Api) {
    Api["Login"] = "/login";
    Api["GetUserInfoById"] = "/getUserInfoById";
    Api["GetPermCodeByUserId"] = "/getPermCodeByUserId";
})(Api || (Api = {}));
/**
 * @description: user login api
 */
export function loginApi(params, mode = 'modal') {
    return defHttp.request({
        url: Api.Login,
        method: 'POST',
        params,
    }, {
        errorMessageMode: mode,
    });
}
/**
 * @description: getUserInfoById
 */
export function getUserInfoById(params) {
    return defHttp.request({
        url: Api.GetUserInfoById,
        method: 'GET',
        params,
    });
}
export function getPermCodeByUserId(params) {
    return defHttp.request({
        url: Api.GetPermCodeByUserId,
        method: 'GET',
        params,
    });
}
//# sourceMappingURL=user.js.map