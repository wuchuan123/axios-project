import lottie, {AnimationItem} from 'lottie-web';
import {getSlotFn} from '../microfe';
import succAnimationData from '../assets/json/success.json';
import errAnimationData from '../assets/json/failed.json';
import loadingAnimationData from '../assets/json/loading.json';
import './interact.less';

const PREFIX = 'paic_aiclaim_http';

const getSlot = (): HTMLElement => {
  let slot = getSlotFn()();
  if (!slot) slot = document.body;
  return slot as HTMLElement;
};

const guidCache: any = {};
const genGuid = (app: string) => {
  if (!guidCache[app]) {
    const stamp = Date.now();
    guidCache[app] = `${PREFIX}_id_${stamp}_${app}`;
  }
  return guidCache[app];
};

const genClzName = (clzName: string) => `${PREFIX}-clz-${clzName}`;

const mountWrapper = (app: string, wrapper: HTMLElement): HTMLElement => {
  const slot = getSlot();
  if (slot.contains(wrapper)) return wrapper;
  slot.appendChild(wrapper);
  return wrapper;
};

const isHTMLElement = (el: Element | null): el is HTMLElement => el instanceof HTMLElement;
const WRAPPER_ELM_CLZ = genClzName('wrapper');
const createWrapper = (app: string): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.id = genGuid(app);
  wrapper.className = WRAPPER_ELM_CLZ;

  // 创建遮罩
  const ELM_CLZ_MASK = genClzName('mask');
  const mask = document.createElement('div');
  mask.className = ELM_CLZ_MASK;
  wrapper.appendChild(mask);
  return wrapper;
};

const DISPLAY_SHOW = 'block';
const DISPLAY_HIDE = 'none';

interface Animations {
  appId?: AnimationItem;
}

const loadingAnimations: Animations | any = {};

interface Animations {
  appId?: AnimationItem;
}

const errAnimations: Animations | any = {};

interface Animations {
  appId?: AnimationItem;
}

const succAnimations: Animations | any = {};

const wrapperEl: any = {};
const getWrapperElm = (app: string): HTMLElement => {
  if (!wrapperEl[app]) wrapperEl[app] = createWrapper(app);
  return wrapperEl[app];
};

const removeWrapper = (app: string) => {
  const wrapper: HTMLElement = getWrapperElm(app);
  // 这里tab切换场景可能会导致slot找不到，忽略掉异常
  try {
    const slot = getSlot();
    slot.removeChild(wrapper);
  } catch (e) {
  }
  delete wrapperEl[app];
};

const show = (app: string, animation: AnimationItem, tipElm: HTMLElement, msg: string) => {
  animation.play();
  const rootWrapper = getWrapperElm(app);
  Object.assign(tipElm, {textContent: msg});
  mountWrapper(app, rootWrapper);
  Object.assign(rootWrapper.style, {display: DISPLAY_SHOW});
};

export const free = (app: string): void => {
  if (!loadingAnimations[app] && !errAnimations[app] && !succAnimations[app]) {
    removeWrapper(app);
  }
};
const hide = (app: string, wrapper: HTMLElement, animation: AnimationItem, tipElm: HTMLElement) => {
  animation.destroy();
  Object.assign(tipElm, ({textContent: ''}));
  Object.assign(wrapper.style, {display: DISPLAY_HIDE});
};

const getElmByClz = (app: string, className: string, parent?: HTMLElement): HTMLElement => {
  const wrapper = getWrapperElm(app);
  const root = parent || wrapper;
  let elm = root.querySelector(`.${className}`);
  if (!isHTMLElement(elm)) {
    elm = document.createElement('div');
    elm.className = className;
  }
  root.appendChild(elm);
  return elm as HTMLElement;
};

const ELM_CLZ_LOAD_SUCC = genClzName('load-succ');

const ANIMATION_ELM_CLZ_LOAD_SUCC = genClzName('load-succ-animation');
const TIP_ELM_CLZ_LOAD_SUCC = genClzName('load-succ-tips');
const getSuccElm = (app: string): HTMLElement => getElmByClz(app, ELM_CLZ_LOAD_SUCC);
const getSuccAnimationElm = (app: string): HTMLElement => {
  const succElm = getSuccElm(app);
  return getElmByClz(app, ANIMATION_ELM_CLZ_LOAD_SUCC, succElm);
};
const getSuccTipElm = (app: string) => {
  const succElm = getSuccElm(app);
  return getElmByClz(app, TIP_ELM_CLZ_LOAD_SUCC, succElm);
};

const getSuccAnimation = (app: string) => {
  if (!succAnimations[app]) {
    const animationElm = getSuccAnimationElm(app);
    succAnimations[app] = lottie.loadAnimation({
      container: animationElm, renderer: 'svg', loop: true, autoplay: false,
      animationData: succAnimationData
    });
  }
  return succAnimations[app];
};
export const showSucc = (app: string, msg = '加载成功'): void => {
  const animation = getSuccAnimation(app);
  const tipElm = getSuccTipElm(app);
  show(app, animation, tipElm, msg);
};
export const hideSucc = (app: string): void => {
  const animation = getSuccAnimation(app);
  const wrapper = getWrapperElm(app);
  const tipElm = getSuccTipElm(app);
  hide(app, wrapper, animation, tipElm);
  delete succAnimations[app];
  free(app);
};
const ELM_CLZ_LOAD_ERR = genClzName('load-err');
const ANIMATION_ELM_CLZ_LOAD_ERR = genClzName('load-err-animation');
const TIP_ELM_CLZ_LOAD_ERR = genClzName('load-err-tips');
const getErrElm = (app: string): HTMLElement => getElmByClz(app, ELM_CLZ_LOAD_ERR);
const getErrAnimationElm = (app: string): HTMLElement => {
  const errElm = getErrElm(app);
  return getElmByClz(app, ANIMATION_ELM_CLZ_LOAD_ERR, errElm);
};
const getErrTipElm = (app: string): HTMLElement => {
  const errElm = getErrElm(app);
  return getElmByClz(app, TIP_ELM_CLZ_LOAD_ERR, errElm);
};
const getErrAnimation = (app: string) => {
  if (!errAnimations[app]) {
    const animationElm = getErrAnimationElm(app);
    errAnimations[app] = lottie.loadAnimation({
      container: animationElm, renderer: 'svg', loop: true,
      autoplay: false,
      animationData: errAnimationData,
    });
  }
  return errAnimations[app];
};
export const showErr = (app: string, msg = '加载失败'): void => {
  const animation = getErrAnimation(app);
  const tipElm = getErrTipElm(app);
  show(app, animation, tipElm, msg);
};
export const hideErr = (app: string): void => {
  const animation = getErrAnimation(app);
  const wrapper = getWrapperElm(app);
  const tipElm = getErrTipElm(app);
  hide(app, wrapper, animation, tipElm);
  delete errAnimations[app];
  free(app);
};
const ELM_CLZ_LOADING = genClzName('loading');
const ANIMATION_ELM_CLZ_LOADING = genClzName('loading-animation');
const TIP_ELM_CLZ_LOADING = genClzName('loading-tips');

const getLoadingElm = (app: string): HTMLElement => getElmByClz(app, ELM_CLZ_LOADING);
const getLoadingAnimationElm = (app: string): HTMLElement => {
  const loadingElm = getLoadingElm(app);
  return getElmByClz(app, ANIMATION_ELM_CLZ_LOADING, loadingElm);
};

const getLoadingTipElm = (app: string): HTMLElement => {
  const loadingElm = getLoadingElm(app);
  return getElmByClz(app, TIP_ELM_CLZ_LOADING, loadingElm);
};
const getLoadingAnimation = (app: string) => {
  if (!loadingAnimations[app]) {
    const animationElm = getLoadingAnimationElm(app);
    loadingAnimations[app] = lottie.loadAnimation({
      container: animationElm, renderer: 'svg', loop: true,
      autoplay: true,
      animationData: loadingAnimationData,
    });
    return loadingAnimations[app];
  }
};
export const showLoading = (app: string, msg = '加载中...'): void => {
  const animation = getLoadingAnimation(app);
  const tipELm = getLoadingTipElm(app);
  show(app, animation, tipELm, msg);
};
export const hideLoading=(app: string):void=>{
  const animation = getLoadingAnimation(app);
  const wrapper = getWrapperElm(app);
  const tipElm = getLoadingTipElm(app);
  hide(app, wrapper, animation, tipElm);
  delete loadingAnimations[app];
  free(app);
}