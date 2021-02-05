import { userStore } from '/@/store/modules/user';
/**
 * @description:  Get token
 * @return jwt token
 */
export function getToken() {
    return userStore.getTokenState;
}
//# sourceMappingURL=index.js.map