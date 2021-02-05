import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';
import { cacheCipher } from '/@/settings/encryptionSetting';
import Encryption from '/@/utils/encryption/aesEncryption';
export const createStorage = ({ prefixKey = '', storage = sessionStorage, key = cacheCipher.key, iv = cacheCipher.iv, hasEncrypt = true, } = {}) => {
    if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
        throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
    }
    const encryption = new Encryption({ key, iv });
    /**
     *Cache class
     *Construction parameters can be passed into sessionStorage, localStorage,
     * @class Cache
     * @example
     */
    const WebStorage = class WebStorage {
        /**
         *
         * @param {*} storage
         */
        constructor() {
            this.storage = storage;
            this.prefixKey = prefixKey;
            this.encryption = encryption;
            this.hasEncrypt = hasEncrypt;
        }
        getKey(key) {
            return `${this.prefixKey}${key}`.toUpperCase();
        }
        /**
         *
         *  Set cache
         * @param {string} key
         * @param {*} value
         * @expire Expiration time in seconds
         * @memberof Cache
         */
        set(key, value, expire = DEFAULT_CACHE_TIME) {
            const stringData = JSON.stringify({
                value,
                expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
            });
            const stringifyValue = this.hasEncrypt
                ? this.encryption.encryptByAES(stringData)
                : stringData;
            this.storage.setItem(this.getKey(key), stringifyValue);
        }
        /**
         *Read cache
         * @param {string} key
         * @memberof Cache
         */
        get(key, def = null) {
            const item = this.storage.getItem(this.getKey(key));
            if (item) {
                try {
                    const decItem = this.hasEncrypt ? this.encryption.decryptByAES(item) : item;
                    const data = JSON.parse(decItem);
                    const { value, expire } = data;
                    if (expire === null || expire >= new Date().getTime()) {
                        return value;
                    }
                    this.remove(this.getKey(key));
                }
                catch (e) {
                    return def;
                }
            }
            return def;
        }
        /**
         * Delete cache based on key
         * @param {string} key
         * @memberof Cache
         */
        remove(key) {
            this.storage.removeItem(this.getKey(key));
        }
        /**
         * Delete all caches of this instance
         */
        clear() {
            this.storage.clear();
        }
    };
    return new WebStorage();
};
//# sourceMappingURL=storageCache.js.map