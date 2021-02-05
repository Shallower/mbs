import axios from 'axios';
import { AxiosCanceler } from './axiosCancel';
import { isFunction } from '/@/utils/is';
import { cloneDeep } from 'lodash-es';
// import { ContentTypeEnum } from '/@/enums/httpEnum';
import { errorResult } from './const';
import { ContentTypeEnum } from '/@/enums/httpEnum';
export * from './axiosTransform';
/**
 * @description:  axios模块
 */
export class VAxios {
    constructor(options) {
        this.options = options;
        this.axiosInstance = axios.create(options);
        this.setupInterceptors();
    }
    /**
     * @description:  创建axios实例
     */
    createAxios(config) {
        this.axiosInstance = axios.create(config);
    }
    getTransform() {
        const { transform } = this.options;
        return transform;
    }
    getAxios() {
        return this.axiosInstance;
    }
    /**
     * @description: 重新配置axios
     */
    configAxios(config) {
        if (!this.axiosInstance) {
            return;
        }
        this.createAxios(config);
    }
    /**
     * @description: 设置通用header
     */
    setHeader(headers) {
        if (!this.axiosInstance) {
            return;
        }
        Object.assign(this.axiosInstance.defaults.headers, headers);
    }
    /**
     * @description: 拦截器配置
     */
    setupInterceptors() {
        const transform = this.getTransform();
        if (!transform) {
            return;
        }
        const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch, } = transform;
        const axiosCanceler = new AxiosCanceler();
        // 请求拦截器配置处理
        this.axiosInstance.interceptors.request.use((config) => {
            // If cancel repeat request is turned on, then cancel repeat request is prohibited
            const { headers: { ignoreCancelToken } = { ignoreCancelToken: false } } = config;
            !ignoreCancelToken && axiosCanceler.addPending(config);
            if (requestInterceptors && isFunction(requestInterceptors)) {
                config = requestInterceptors(config);
            }
            return config;
        }, undefined);
        // 请求拦截器错误捕获
        requestInterceptorsCatch &&
            isFunction(requestInterceptorsCatch) &&
            this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);
        // 响应结果拦截器处理
        this.axiosInstance.interceptors.response.use((res) => {
            res && axiosCanceler.removePending(res.config);
            if (responseInterceptors && isFunction(responseInterceptors)) {
                res = responseInterceptors(res);
            }
            return res;
        }, undefined);
        // 响应结果拦截器错误捕获
        responseInterceptorsCatch &&
            isFunction(responseInterceptorsCatch) &&
            this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
    }
    /**
     * @description:  文件上传
     */
    uploadFile(config, params) {
        const formData = new window.FormData();
        if (params.data) {
            Object.keys(params.data).forEach((key) => {
                if (!params.data)
                    return;
                const value = params.data[key];
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(`${key}[]`, item);
                    });
                    return;
                }
                formData.append(key, params.data[key]);
            });
        }
        formData.append(params.name || 'file', params.file, params.filename);
        return this.axiosInstance.request({
            ...config,
            method: 'POST',
            data: formData,
            headers: {
                'Content-type': ContentTypeEnum.FORM_DATA,
                ignoreCancelToken: true,
            },
        });
    }
    /**
     * @description:   请求方法
     */
    request(config, options) {
        let conf = cloneDeep(config);
        const transform = this.getTransform();
        const { requestOptions } = this.options;
        const opt = Object.assign({}, requestOptions, options);
        const { beforeRequestHook, requestCatch, transformRequestData } = transform || {};
        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt);
        }
        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request(conf)
                .then((res) => {
                if (transformRequestData && isFunction(transformRequestData)) {
                    const ret = transformRequestData(res, opt);
                    ret !== errorResult ? resolve(ret) : reject(new Error('request error!'));
                    return;
                }
                resolve(res);
            })
                .catch((e) => {
                if (requestCatch && isFunction(requestCatch)) {
                    reject(requestCatch(e));
                    return;
                }
                reject(e);
            });
        });
    }
}
//# sourceMappingURL=Axios.js.map