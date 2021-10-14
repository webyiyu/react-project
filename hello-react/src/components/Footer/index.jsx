import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {

  handleCheck =(event)=>{
    this.props.updateAllTodo(event.target.checked);
  }

  render() {
    const {todos,clearAll} = this.props;
    const checkedLength = todos.reduce((pre, cur)=> pre + (cur.done? 1: 0),0);
    return (
      <div className="footer">
        <div>
          <input type="checkbox" onChange={this.handleCheck} checked={ checkedLength === todos.length && !!todos.length } />
          <span>已完成{checkedLength} </span>
          /
          <span> 全部 {todos.length}</span>
        </div>
        <button className="btn-remove" onClick={clearAll}>清除已完成任务</button>
        
      </div>
    );
  }
}

export default Footer; 