/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-19 23:20:07
 * @FilePath: \react-project\basic\src\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from './react';
import ReactDOM from './react-dom';

let element1 = (
  <div className="title" style={{ color: "red" }}>
    <span>hello</span>world
  </div>
);

function FunctionComponent(props) {
  return (
    <h1 className='title'>function component</h1>
  )
}

class ClassComponent extends React.Component {
  render() {
    return (
      <h1 style={{color: 'red',}}>类组件</h1>
    )
  }
}
const class1 = <ClassComponent msg="classComponent" />
console.log(class1)
const func1 = <FunctionComponent msg='world'></FunctionComponent>
console.log(JSON.stringify(element1, null, 2));
// ReactDOM.render(element1, document.getElementById("root"));
console.log(func1)
ReactDOM.render(class1, document.getElementById("root"));

