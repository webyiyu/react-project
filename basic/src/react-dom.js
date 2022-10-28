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
  vdom.classInstance = classInstance
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

export function compareTwoVDom(parentDom, oldVDOM, newVdom, nextDOM) {
  // 新老节点比较
  // let oldDOM = findDOM(oldVDOM)
  // let newDOM = createDOM(newVdom)
  // parentDom.replaceChild(newDOM, oldDOM)
  if(!oldVDOM && !newVdom) {
    // 新老节点都没有 直接返回
    return
  }else if(oldVDOM && !newVdom) {
    // 有老节点 无新节点
    // 直接删除老节点
    unMountVdom(oldVDOM)
  }else if(!oldVDOM && newVdom) {
    // 有新节点 无老节点
    // 直接创建节点 插入元素中
    let newDOM = createDOM(newVdom)
    if(nextDOM) {
      // 如果有指定的插入节点
      parentDom.insertBefore(newDOM, nextDOM)
    }else {
      parentDom.appendChild(newDOM)
    }
    if(newDOM.componentDidMount) newDOM.componentDidMount()
    return
  }else if(newVdom && oldVDOM && newVdom.type !== oldVDOM.type) {
    // 新老节点都有并且类型不同
    // 创建新节点 删除老节点
    let newDOM =  createDOM(newVdom)
    unMountVdom(oldVDOM)
    if(newDOM.componentDidMount) newDOM.componentDidMount()
  }else {
    // 新老节点都有并且类型相同
    updateElement(oldVDOM, newVdom)
  }
}
function unMountVdom(vdom) {
  let { props, ref} = vdom
  const currentDom = findDOM(vdom)
  if(vdom.classInstance && vdom.classInstance.componentWillUnmount){
    vdom.classInstance.componentWillUnmount()
  }
  if(ref) {
    ref.current = null
  }
  // 如果有子节点，递归删除子节点
  if(props.children){
    let children = Array.isArray(props.children) ? props.children : [props.children]
    children.forEach(unMountVdom)
  }
  if(currentDom) currentDom.remove()

}

function updateElement(oldVdom, newVdom) {
// 如果是文本 直接替换新节点的文本内容
  if(oldVdom.type === REACT_TEXT) {
    let currentDom = newVdom.dom = findDOM(oldVdom)
    if(oldVdom.props !== newVdom.props) {
      currentDom.textContent = newVdom.props
    }
    return
  }else if(typeof oldVdom.type === 'string') {
    // 如果是原生节点 更新新节点的属性值和子节点属性
    let currentDom = newVdom.dom = findDOM(oldVdom)
    updateProps(currentDom, oldVdom.props, newVdom.props)
    updateChildren(currentDom, oldVdom.props.children, newVdom.props.children)
  }else if(typeof oldVdom.type === 'function') {
    // 如果是函数组件或者类组件
    if(oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom)
    }else {
      updateFunctionComponent(oldVdom, newVdom)
    }
  }
}

function updateChildren(parentDom, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : 
                 oldVChildren? [oldVChildren].filter(item => item) : []
  newVChildren = Array.isArray(newVChildren) ? newVChildren : 
                 newVChildren? [newVChildren].filter(item => item) : []
  let maxLen = Math.max(newVChildren.length, oldVChildren.length)
  for(let i = 0; i< maxLen; i++) {
    let nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item))
    compareTwoVDom(parentDom, oldVChildren[i], newVChildren[i], nextVdom&&findDOM(nextVdom))
  }
}

function updateClassComponent(oldVdom, newVdom) {
  let classInstance = newVdom.classInstance = oldVdom.classInstance
  if(classInstance && classInstance.componentWillReceiveProps){
    classInstance.componentWillReceiveProps(newVdom.props)
  }
  classInstance.updater.emitUpdate(newVdom.props)
}

function updateFunctionComponent(oldVdom, newVdom) {
  let currentDom = findDOM(oldVdom)
  if(!currentDom) return
  let parentDom = currentDom.parentNode
  let {type, props} = newVdom
  let newRenderVDom = type(props)
  compareTwoVDom(parentDom, oldVdom.oldRenderVDom, newRenderVDom)
  newVdom.oldRenderVDom = newRenderVDom
}
const ReactDOM = {
  render
}
export default ReactDOM