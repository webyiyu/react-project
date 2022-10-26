/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-26 23:49:52
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
class Sum extends React.Component{
  constructor(props) {
    super(props)
    this.a = React.createRef()
    this.b = React.createRef()
    this.result = React.createRef()
  }
  handleBtnClick = ()=>{
    const a = this.a.current.value
    const b = this.b.current.value
    this.result.current.value = a + b
  }
  render() {
    return (
      <div>
        <input ref={this.a} />+ <input ref={this.b} /> <button onClick={this.handleBtnClick}>=</button> <input ref={this.result} />
      </div>
    )
  }
}

function FunInput(props, ref) {
  let userRef = React.createRef()
  ref.current = {
    getFocus: ()=>{
      userRef.current.focus()
    }
  }
  return (
    <input ref={userRef} />
  )
}
const ForwardFunInput = React.forwardRef(FunInput)
console.log(ForwardFunInput)
class Form extends React.Component{
  constructor(props){
    super(props)
    this.input = React.createRef()
  }
  getFocus = ()=>{
    this.input.current.getFocus()
  }
  render() {
    return (
      <div>
        {/* <input ref={this.input} /> */}
        {/* <TextInput ref={this.input} /> */}
        <ForwardFunInput ref={this.input} />
        <button onClick={this.getFocus}>获取焦点</button>
      </div>
    )
  }
}

class TextInput extends React.Component{
  constructor(props) {
    super(props)
    this.input = React.createRef()
  }
  getFocus = ()=>{
    this.input.current.focus()
  }
  render() {
    return (
      <input ref={this.input}  />
    )
  }
}


// const func1 = <FunctionComponent msg='world'></FunctionComponent>
// ReactDOM.render(element1, document.getElementById("root"));
// console.log(func1)
ReactDOM.render(class1, document.getElementById("root"));
ReactDOM.render(<Sum />, document.getElementById("root"));
ReactDOM.render(<Form />, document.getElementById("root"));

