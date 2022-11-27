import {AxiosRequestConfig} from 'axios';
import {AxiosRequestConfigExtend} from "../types";

const cacheMap = new Map();

const createIdFunction = (): any => {
  let localRequestId = 0;
  const MAX_ID = 1000;
  return () => {
    if (localRequestId > MAX_ID) {
      localRequestId = 0;
    } else {
      localRequestId += 1;
    }
    return localRequestId;
  };
};

const createLocalRequestId = createIdFunction();

export const setLocalRequestId = (config: AxiosRequestConfigExtend): AxiosRequestConfigExtend => {
  const conf: AxiosRequestConfigExtend = config;
  if (!conf.headers) {
    conf.headers = {};
  }
  const localRequestId: number = createLocalRequestId();
  conf.headers.localRequestId = localRequestId;
  return conf;
};

export const getLocalRequestId = (config: AxiosRequestConfig): string => {
  let localRequestId = 0;
  const {headers} = config;
  if (headers && headers.localRequestId) {
    localRequestId = headers.localRequestId as number;
  }
  return String(localRequestId);
};

const set = (key: string, config: AxiosRequestConfigExtend): void => {
  cacheMap.set(key, config);
};

const get = (key: string): AxiosRequestConfigExtend => {
  const config = cacheMap.get(key);
  return config;
};

const remove = (key: string): boolean => cacheMap.delete(key);

export default {
  set, get, remove
};