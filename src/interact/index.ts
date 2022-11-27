import {hideErr, hideLoading, hideSucc, showErr, showLoading, showSucc} from './interact';
import {getPageId} from '../microfe';

const status: any = {};

const genAppStatus = (page: string) => {
  if (!status[page]) {
    status[page] = {
      loadingCount: 0,
      showingResult: false,
    };
  }
};

enum MessageType {
  SUCC = 'SUCC', ERR = 'ERR',
}

interface Message {
  page: string;
  type: MessageType;
  msg: string;
  timeout: number;
}

interface Queque {
  page?: Message;
}

// 只有成功和失败的提示才会进入队列
const queque: Queque | any = {};
const consume = async (page: string) => {
  const appStatus = status[page];
  if (appStatus.showingResult || appStatus.loadingCount > 0) return;
  appStatus.showingResult = true;
  const MAPPING: any = {
    [MessageType.SUCC]: [showSucc, hideSucc,],
    [MessageType.ERR]: [showErr, hideErr,]
  };
  const msg = (queque[page] || []).shift();
  if (!msg) {
    appStatus.showingResult = false;
// 释放内存
    delete queque[page];
    return;
  }
  const {type, timeout, msg: message} = msg;
  const exeQueque = MAPPING[type];
  if (!exeQueque) {
    appStatus.showingResult = false;
    return;
  }

  const exec = (showMsg: string) => {
    const [show, hide] = exeQueque;
    show(page, showMsg);
    return new Promise((resolve) => {
      setTimeout(() => {
          hide(page);
          appStatus.showingResult = false;
          resolve(true);
        },
        timeout);
    });
  };
  await exec(message);
  await consume(page);
};

const addLoadingCount = (page: string) => {
  genAppStatus(page);
  status[page].loadingCount += 1;
  return status[page].loadingCount;
};

const subLoadingCount = (page: string) => {
  status[page].loadingCount -= 1;
  const {loadingCount} = status[page];
  if (!loadingCount) {
    consume(page);

    // 释放内存
    delete status[page];
  }
  return loadingCount;
};

export const succeed = (msg: string, timeout = 3000): void => {
  const page = getPageId();
  if (!queque[page]) queque[page] = [];
  queque[page].push({
    page,
    type: MessageType.SUCC,
    msg,
    timeout,
  });
  consume(page);
};

export const hasErr = (msg: string, timeout = 3000): void => {
  const page = getPageId();
  if (!queque[page]) queque[page] = [];
  queque[page].push({
    page,
    type: MessageType.ERR,
    msg,
    timeout,
  });
  consume(page);
};
export const loading = (page: string): void => {
  const loadingCount = addLoadingCount(page);
  if (loadingCount === 1) showLoading(page);
};
export const loaded = (page: string): void => {
  const loadingCount = subLoadingCount(page);
  if (!loadingCount) hideLoading(page);
};