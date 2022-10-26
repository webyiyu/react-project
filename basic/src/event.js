/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-25 22:50:56
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-25 23:28:31
 * @FilePath: \react-project\basic\src\event.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {updateQueue} from './component'
// 给DOM节点绑定事件
export function addEvent(dom, eventType, handler) {
  let store = dom.store || (dom.store = {})
  store[eventType] = handler
  if(!document[eventType]) {
    document[eventType] = dispatchEvent
  }
}

// 派发事件
function dispatchEvent(event) {
  let { target, type } = event;
  let eventType = `on${type}`;
  let syntheticEvent = createSyntheticEvent(event);
  updateQueue.isBathingUpdate = true;
  while (target) {
    let { store } = target;
    let handler = store && store[eventType]
    handler && handler(syntheticEvent);
    //在执行handler的过程中有可能会阻止冒泡
    if (syntheticEvent.isPropagationStopped) {
      break;
    }
    target = target.parentNode;
  }
  updateQueue.batchUpdate();
}
function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {//把原生事件上的属性拷贝到合成事件对象上去
    let value = nativeEvent[key];
    if(typeof value === 'function')value=value.bind(nativeEvent);
    syntheticEvent[key] = nativeEvent[key];
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false;
  syntheticEvent.isPropagationStopped = false;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

function preventDefault() {
  this.defaultPrevented = true;
  const event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {//IE
    event.returnValue = false;
  }
  this.isDefaultPrevented = true;
}

function stopPropagation() {
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {//IE
    event.cancelBubble = true;
  }
  this.isPropagationStopped = true;
}
