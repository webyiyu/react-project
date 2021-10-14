import React, { Component } from 'react';
import './header.css';
import {nanoid} from 'nanoid';
import {PropTypes} from 'prop-types';

class Header extends Component {

  static propTypes = {
    addTodo: PropTypes.func.isRequired
  }

  handleKeyUp = (e)=>{
    const {target, keyCode} = e,
          {value} = target;
    if(keyCode !== 13) return;
    if(value.trim() === ''){
      alert('请输入')
      return
    }
    const todoItem = {
      id: nanoid(),
      name: value,
      done: false
    }
    this.props.addTodo(todoItem)
    target.value = ''
  }

  render() {
    return (
      <div>
        <input onKeyUp={this.handleKeyUp} className="input-text" type="text" placeholder="请输入任务名称，按回车键确认" />
      </div>
    );
  }
}

export default Header;