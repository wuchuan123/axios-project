// 通过class name设置HTTP请求弹窗遮罩的挂载点
import {OnErrorHandle, SetEnvConfig} from './fetch';
import Axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {AxiosRequestConfigExtend} from '../types';
import reqCfgStroage, {getLocalRequestId, setLocalRequestId} from './reqCfgStroage';
import cloneDeep from 'lodash.clonedeep';
import {getPageId, setSlotFn} from './microfe';
import {hasErr, loaded, loading, succeed} from './interact';

export const HTTP_MOUNT_SLOT_CLZ_NAME = 'paic_aiclam_http_mount_slot';
const SUCCESS_CODE = ['000000'];
const ErrorHandleQueue: OnErrorHandle[] = [];
let getProjectEnvConfig: SetEnvConfig;

function runErrorHandle(message: string, status?: number, config?: AxiosRequestConfig) {
  ErrorHandleQueue.forEach((errorHandle) => {
    errorHandle(message, status, config);
  });
}

const getCacheConfig = (config: AxiosRequestConfig): AxiosRequestConfigExtend => {
  const localRequestId: string = getLocalRequestId(config);
  const cache: AxiosRequestConfigExtend = reqCfgStroage.get(localRequestId);
  return cache;
};

const clearCacheRConfig = (config: AxiosRequestConfig): void => {
  const localRequestId: string = getLocalRequestId(config);
  reqCfgStroage.remove(localRequestId);
};
const setLocalRequestIdAndCacheRequestConfig = (config: AxiosRequestConfigExtend): void => {
  const conf: AxiosRequestConfigExtend = setLocalRequestId(config);
  const localRequestId = getLocalRequestId(conf);
  reqCfgStroage.set(localRequestId, conf);
};

const realRequest = Axios.prototype.constructor.Axios.prototype.request;
Axios.prototype.constructor.Axios.prototype.request = function r(config: AxiosRequestConfigExtend) {
  setLocalRequestIdAndCacheRequestConfig(config);
  return realRequest.call(this, config);
};
export const BASE_URL = '/gateway';
export const create = (): AxiosInstance => {
  let axios = window.paicAiClaimAxiosInstance as AxiosInstance;
  if (axios) {
    axios = Axios.create({
      baseURL: BASE_URL, timeout: 30000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    window.paicAiClaimAxiosInstance = axios;
    axios.interceptors.request.use(async (axiosRequestConfig: AxiosRequestConfig) => {
      const config = cloneDeep(axiosRequestConfig);
      const reqConf: AxiosRequestConfigExtend = getCacheConfig(config);
      if (!reqConf || !reqConf.quiet) {
        const pageId = getPageId();
        reqConf.pageId = pageId;
        loading(pageId);
      }
      const {url, method} = config;
      let {headers} = config;
      // 确保headers不为空
      if (!headers) {
        headers = {};
        Object.assign(config, {headers});
      }
      // 数据脱敏控制
      // dataMasking为true:前端控制强制脱敏* dataMasking为false:前端控制强制不脱敏* 其他值:按后端逻辑控制是否脱敏*/
      if (reqConf.dataMasking === true) {
        Object.assign(headers, {'Need-Masking-Flag': 'Y'});
      } else if (reqConf.dataMasking === false) {
        Object.assign(headers, {'Need-Masking-Flag': 'N'});
      } else {
        // 不设置Need-Masking-Flag，按后端逻辑控制是否脱敏
      }
      if (url) {
        const customConf = await getApiEnvItem(url);
        const {headers: customHeaders, params: customParams} = customConf;
        Object.assign(headers, customHeaders);
        if (method === 'get') {
          if (!config.params) Object.assign(config, {params: {}});
          Object.assign(config.params, customParams);
        } else {
          if (!config.data) Object.assign(config, {data: {}});
          Object.assign(config.data, customParams);
        }
        if (getProjectEnvConfig) {
          const {headers: projHeaders, params: projParams} = await getProjectEnvConfig(url);
          if (projHeaders) Object.assign(headers, projHeaders);
          if (projParams) {
            if (method === 'get') {
              if (!config.params) Object.assign(config, {params: {}});
              Object.assign(config.params, projParams);
            } else {
              if (!config.data) Object.assign(config, {data: {}});
              Object.assign(config.data, projParams);
            }
          }

        }
      }
      return config;
    });
    axios.interceptors.response.use((response: AxiosResponse) => {
      const {code} = response.data;
      const cacheConf: AxiosRequestConfigExtend = getCacheConfig(response.config);
      if (!cacheConf || !cacheConf.quiet) {
        loaded(cacheConf.pageId);
      }
      clearCacheRConfig(response.config);
      if (SUCCESS_CODE.includes(code)) {
        return response?.data?.data;
      }
      const {msg} = response.data;
      runErrorHandle(msg, response.status, response.config);
      return Promise.reject(response.data);
    }, (error: AxiosError) => {
      const cacheConf: AxiosRequestConfigExtend = getCacheConfig(error.config);
      if (!cacheConf || !cacheConf.quiet) {
        loaded(cacheConf.pageId);
      }
      runErrorHandle(error.message, error?.response?.status, error?.response?.config);
      return Promise.reject(error);
    });
  }
  return axios;
};
create()
export default window.paicAiClaimAxiosInstance

export {
  setSlotFn,
  succeed,
  hasErr
}






