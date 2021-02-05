import CryptoES from 'crypto-es';
export class Encryption {
    constructor(opt) {
        const { key, iv } = opt;
        this.key = CryptoES.enc.Utf8.parse(key);
        this.iv = CryptoES.enc.Utf8.parse(iv);
    }
    get getOpt() {
        return {
            mode: CryptoES.mode.CBC,
            padding: CryptoES.pad.Pkcs7,
            iv: this.iv,
        };
    }
    encryptByAES(str) {
        const encrypted = CryptoES.AES.encrypt(str, this.key, this.getOpt);
        return encrypted.toString();
    }
    decryptByAES(str) {
        const decrypted = CryptoES.AES.decrypt(str, this.key, this.getOpt);
        return decrypted.toString(CryptoES.enc.Utf8);
    }
}
export default Encryption;
//# sourceMappingURL=aesEncryption.js.map