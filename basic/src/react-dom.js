/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-26 23:49:17
 * @FilePath: \react-project\basic\src\react-dom.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { REACT_TEXT, REACT_FORWARD } from "./constant"
import { addEvent } from './event'

export function createDOM(vdom) {
  // 判别虚拟dom类型，根据类型生成对应的节点元素
  // 绑定props
  let {type, props, ref} = vdom
  let dom;
  if(type && type.$$typeof === REACT_FORWARD) {
    return mountForwardComponent(vdom)
  }else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if(typeof type === 'function') {
    if(type.isReactComponent) {
      return mountClassComponent(vdom)
    }else{
      return mountFunctionComponent(vdom)
    }
  }else {
    dom = document.createElement(type);
  }
  if(props) {
    updateProps(dom, {}, props);
    if(typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom)
    }else if(Array.isArray(props.children)) {
      reconcileChildren(props.children, dom)
    }
  }
  vdom.dom = dom
  if(ref) ref.current = dom
  return dom
}

function updateProps(dom, oldProps={}, newProps={}) {
  // 遍历增加新属性
  for(let key in newProps) {
    if(key === 'children') {
      continue
    }else if(key === 'style') {
      let styleObj = newProps[key]
      for(let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if(/^on[A-Z].*/.test(key)) {
      // dom[key.toLowerCase()] = newProps[key]
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
    }else {
      dom[key] = newProps[key]
    }
  }
  // 遍历老属性，去除掉新属性中不存在的
  for(let key in oldProps) {
    if(!newProps.hasOwnProperty(key)) {
      dom[key] = null
    }
  }
}

function reconcileChildren(childrenVdom, parentDom) {
  for(let i = 0; i< childrenVdom.length; i++) {
    mount(childrenVdom[i], parentDom)
  }
}
function render(vdom, container) {
  mount(vdom, container)
}
function mount(vdom, container) {
  // 虚拟dom生成一个真实dom
  const newDOM = createDOM(vdom)
  if(newDOM) {
    // 真实dom挂载到容器内
    container.appendChild(newDOM)
    if(newDOM.componentDidMount) newDOM.componentDidMount()
  }
 
}
function mountFunctionComponent(vdom) {
  const {type, props} = vdom
  const renderVdom = type(props)
  vdom.oldRenderVDom = renderVdom
  return createDOM(renderVdom)
}

function mountClassComponent(vdom) {
  const {type, props, ref} = vdom
  const classInstance = new type(props)
  if(ref) ref.current = classInstance
  if(classInstance.componentWillMount) classInstance.componentWillMount()
  const renderVdom = classInstance.render()
  classInstance.oldRenderVDom = renderVdom
  const dom = createDOM(renderVdom)
  if(classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
  }
  return dom
}

function mountForwardComponent(vdom) {
  const {type, props, ref} = vdom
  let renderVdom = type.render(props, ref)
  vdom.oldRenderVDom = renderVdom
  return createDOM(renderVdom)
}
export function findDOM(vdom) {
  if(!vdom) return null
  if(vdom.dom) {
    return vdom.dom
  }else{
    let renderVdom = vdom.oldRenderVDom
    return findDOM(renderVdom)
  }
}

export function compareTwoVDom(parentDom, oldVDOM, newVdom) {
  let oldDOM = findDOM(oldVDOM)
  let newDOM = createDOM(newVdom)
  parentDom.replaceChild(newDOM, oldDOM)
}
const ReactDOM = {
  render
}
export default ReactDOM