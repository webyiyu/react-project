import React, { Component } from 'react';
import './item.css';

class Item extends Component {
  state = {
    mouse: false,
  }

  handleMouse = (flag)=>{
    return ()=>{
      this.setState({
        mouse: flag,
      })
    }
  }

  handleCheck = (id)=>{
    return (event)=>{
      // console.log(id, event.target.checked)
      const {checked} = event.target;
      this.props.updateTodo(id, checked);
    }
  }

  handleDel = (id)=>{
    if(window.confirm('确定删除？')){
      this.props.deleteTodo(id);
    }
  }
  render() {
    const {id,name,done} = this.props;
    const {mouse} = this.state;
    return (
      <li onMouseLeave={this.handleMouse(false)} onMouseEnter={this.handleMouse(true)} className="item" style={{backgroundColor: mouse ? '#ddd':'transparent'}}>
        <label>
          <input type="checkbox" checked={done} onChange={this.handleCheck(id)}/>
          <span>{name}</span>
        </label>
        <button  onClick={()=>{this.handleDel(id)}} className="btn-del" style={{display: mouse ? 'block':'none'}}>删除</button>
      </li>
    );
  }
}

export default Item;