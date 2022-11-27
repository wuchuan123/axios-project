import {AxiosRequestConfig} from "axios";

export type OnErrorHandle = (
  message: string,
  status?: number,
  config?: AxiosRequestConfig
) => Promise<void> | void;

export interface ConfigApiItem {
  [x: string]: string;
}

export interface ConfigApiUnit {
  headers?: ConfigApiItem;
  params?: ConfigApiItem;
}

export type SetEnvConfig = (url: string) => Promise<ConfigApiUnit>;

export interface CreateConfig {
  setEnvConfig?: SetEnvConfig,
  onErrorHandle?: OnErrorHandle
}