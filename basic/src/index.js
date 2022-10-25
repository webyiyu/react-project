/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-25 22:37:29
 * @FilePath: \react-project\basic\src\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from './react';
import ReactDOM from './react-dom';

// let element1 = (
//   <div className="title" style={{ color: "red" }}>
//     <span>hello</span>world
//   </div>
// );

// function FunctionComponent(props) {
//   return (
//     <h1 className='title'>function component</h1>
//   )
// }

class ClassComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }
  handleClick = ()=>{
    this.setState({number: this.state.number + 1})
    console.log(this.state)
    this.setState({number: this.state.number + 1})
    console.log(this.state)
    setTimeout(()=>{
      this.setState({number: this.state.number + 1})
      console.log(this.state)
      this.setState({number: this.state.number + 1})
      console.log(this.state)
    }, 50)
  }
  render() {
    return (
      <div>
        <h1 style={{color: 'red',}}>类组件</h1>
        <p>number: {this.state.number}</p>
        <button onClick={this.handleClick}>添加</button>
      </div>
    )
  }
}
const class1 = <ClassComponent msg="classComponent" />
// const func1 = <FunctionComponent msg='world'></FunctionComponent>
// ReactDOM.render(element1, document.getElementById("root"));
// console.log(func1)
ReactDOM.render(class1, document.getElementById("root"));
