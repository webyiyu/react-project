/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-19 23:18:43
 * @FilePath: \react-project\basic\src\react-dom.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { REACT_TEXT } from "./constant"

export function createDOM(vdom) {
  // 判别虚拟dom类型，根据类型生成对应的节点元素
  // 绑定props
  let {type, props} = vdom
  let dom;
  if (type === REACT_TEXT) {
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
  // 真实dom挂载到容器内
  container.appendChild(newDOM)
}
function mountFunctionComponent(vdom) {
  const {type, props} = vdom
  const renderVdom = type(props)
  return createDOM(renderVdom)
}

function mountClassComponent(vdom) {
  const {type, props} = vdom
  const vdomInstance = new type(props)
  const renderVdom = vdomInstance.render()
  return createDOM(renderVdom)
}
const ReactDOM = {
  render
}
export default ReactDOM