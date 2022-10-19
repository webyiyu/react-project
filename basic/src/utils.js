/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-10 23:41:57
 * @FilePath: \react-project\basic\src\utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { REACT_TEXT } from "./constant";

//注意 此逻辑在源码里没有的，是我们的为了后面方便DOM-DIFF添加的
//经过包装之后所有的儿子元素都是一个对象，而且也都有类型，可以方便后面的比较
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: element }
    : element;
}
