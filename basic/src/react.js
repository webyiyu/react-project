/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-26 23:32:34
 * @FilePath: \react-project\basic\src\react.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {REACT_ELEMENT, REACT_FORWARD, REACT_FRAGMENT, REACT_PROVIDER, REACT_CONTEXT} from './constant'
import {Component} from './component'
import { wrapToVdom } from './utils';
// createElement 就是生成一个虚拟dom
function createElement(type, config, children) {
  let ref, key;
  if(config) {
    delete config.__source
    delete config.__self
    ref = config.ref
    delete config.ref
    key = config.key
    delete config.key
  }
  let props = {...config}
  // 判别children,如果传参是3个以上 说明有多个儿子，
  // children的值就是一个数组
  if(arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  }else {
    // 否则就是 只有一个儿子，children可能是字符串也可能是个对象，如果没有值就是undefined
    props.children = wrapToVdom(children)
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props
  }
}

/*
  createRef 就是默认返回一个对象 {current: null}
  createDOM时， 如果vdom有ref :
    1、如果ref指向的是真实DOM,ref.current赋值为dom
    2、如果ref指向的是一个类组件， 则在创建类组件函数中,ref.current 赋值为类的实例
    3、如果ref指向的是一个函数组件，不可以直接使用ref，需使用React.forwardRef()
*/ 
function createRef() {
  return {current: null}
}
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD,
    render
  }
}

function createContext() {
  let context = {
    _currentValue: undefined,
  }
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context
  }
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  return context
}
const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Fragment: REACT_FRAGMENT,
  createContext
}
export default React