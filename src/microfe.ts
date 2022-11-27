import {name} from '../package.json';
import {SlotResult} from "../types";

let slotFn: SlotResult | null = null;

// 设置获取http挂载点的回调函数 getSlotCallback 获取http挂载点的回调函数
export const setSlotFn = (getSlotCallback: SlotResult): void => {
  if (slotFn) console.warn(`[${name}]: http挂载点已设置，将会被覆盖`);
  slotFn = getSlotCallback;
};

export const getSlotFn = (): SlotResult => {
  if (!slotFn) {
    console.warn(`[${name}]: 您未设置获取http挂载点的回调函数，将默认挂载于document.body`);
    return () => document.body;
  }
  return slotFn;
};

export const getPageId = (): string => {
  const {pathname, hash} = window.location;
  return `${pathname}${hash}`;
};