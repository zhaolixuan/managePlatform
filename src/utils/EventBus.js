// 全局事件绑定和回调
export class EventBus {
  constructor() {
    this.sub = {};
  }

  subscribe(type, callBack) {
    if (typeof type !== 'string' || typeof callBack !== 'function') {
      throw new Error('type error');
    }
    if (!Array.isArray(this.sub[type])) {
      this.sub[type] = [];
    }
    this.sub[type].push(callBack); // this.sub = { popup-close: [onClosePopup, onShowMarker] }
    return 'success';
  }

  publish(type, params) {
    if (typeof type !== 'string') {
      throw new Error('type error');
    }
    const queue = this.sub[type];
    if (queue && queue.length > 0) {
      this.sub[type].forEach(fn => {
        if (fn instanceof Function) {
          // eslint-disable-next-line prefer-rest-params
          fn(params, arguments);
        }
      });
    }
    return 'success';
  }

  // 解绑方法（如果没有callBack，则全部移除）
  unsubscribe(type, callBack) {
    if (typeof type !== 'string') {
      throw new Error('type error');
    }
    if (type) {
      if (!callBack) {
        this.sub[type] = [];
        return null;
      }
      // 为配合单测，将.filter改为?.filter
      this.sub[type] = this.sub[type]?.filter(fn => fn !== callBack);
    }
    return 'success';
  }
}
window.eventBus = new EventBus();

/** ***
 * 示例
window.eventBus.subscribe('dialogVisiablity', (params) => {
  console.log('dialogVisiablity', params);
});
const publish = () => {
  window.eventBus.publish('dialogVisiablity');
};

 */
