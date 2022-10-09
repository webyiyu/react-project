/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-09 23:32:09
 * @FilePath: \react-project\basic\src\react.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {REACT_ELEMENT} from './constant'
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
const React = {
  createElement
}
export default React