/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-09 22:41:06
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-11-01 21:58:32
 * @FilePath: \react-project\basic\src\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from './react';
import ReactDOM from './react-dom';
// context 上下文
let ThemeContext = React.createContext()
const {Provider, Consumer} = ThemeContext
let basicStyle = {margin: '5px', padding: '5px'}

function Title() {
  return(
    <Consumer>
      {
        ((contextValue)=> (
          <div style={{...basicStyle, border: `3px solid ${contextValue.color}`}}>
            title
          </div>
        ))
      }
    </Consumer>
  )
}
class Header extends React.Component {
 static contextType = ThemeContext
  render() {
    return (
      <div style={{...basicStyle, border: `3px solid ${this.context.color}`}}>
        header 
        <Title />
      </div>
    )
  }
}

class Content extends React.Component {
  render() {
    return (
      <Consumer>
        {
          (contextValue) =>(
            <div style={{...basicStyle, border: `3px solid ${contextValue.color}`}}>
              content
              <button onClick={()=> contextValue.changeColor('red')}>变红</button>
              <button onClick={()=> contextValue.changeColor('green')}>变绿</button>
            </div>
          )
        }
      </Consumer>
    )
  }
}
class Main extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{...basicStyle, border: `3px solid ${this.context.color}`}}>
        main
        <Content />
      </div>
    )
  }
}
class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: 'black'
    }
  }
  changeColor = (color)=>{
    this.setState({color})
  }
  render() {
    let contextValue = {
      color: this.state.color,
      changeColor: this.changeColor
    }
    return (
      <Provider value={contextValue}>
        <div style={{...basicStyle, width: '250px',border: `3px solid ${this.state.color}` }}>
          Page
          <Header />
          <Main />
        </div>
      </Provider>
    )
  }
}
ReactDOM.render(<Page />, document.getElementById("root"))