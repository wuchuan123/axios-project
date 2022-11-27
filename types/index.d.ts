import {AxiosRequestConfig, AxiosInstance} from 'axios';

export interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  quiet: boolean,
  dataMasking?: boolean,
  pageId: string, // 发起请求的页面
}

export {AxiosRequestConfig} from 'axios';

interface User {
  id: string;
}

interface PaicAiClaimUserManager {
  user: User;
}

declare global {
  interface Window {
    paicAiClaimAxiosInstance: AxiosInstance | undefined;
    paicAiClaimUserManager: PaicAiClaimUserManager | undefined;
  }
}

export interface HttpConfig {
  portalToken: any;
}

declare const axios: AxiosInstance;

export default axios;

export function succeed(msg: string, timeout?: number): void;

export function hasErr(msg: string, timeout?: number): void;

export const HTTP_MOUNT_SLOT_CLZ_NAME = 'paic_aiclaim_http_mount_slot';

export interface ConfigApiItem {
  [x: string]: string;
}

export interface ConfigApiUnit {
  headers?: ConfigApiItem;
  params?: ConfigApiItem;
}

export type SetEnvConfig = (url: string) => Promise<ConfigApiUnit>;

export type OnErrorHandle = (
  message: string,
  status?: number,
  config?: AxiosRequestConfig
) => Promise<void> | void;

export interface CreateConfig {
  setEnvConfig?: SetEnvConfig,
  onErrorHandle?: OnErrorHandle
}

export function setConfig(createConfig: CreateConfig): void;

export type SlotResult = () => Element | HTMLElement | null;

// 设置获取http挂载点的回调函数 getSlotCallback 获取http挂载点的回调函数
export function setSlotFn(getSlotCallback: SlotResult): void;