import React, { Component } from 'react';
import Item from './../Item'
import { PropTypes } from 'prop-types';

class List extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    updateTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
  }
  render() {
    const {todos,updateTodo,deleteTodo} = this.props;
    return (
      <ul>
        {
          todos.map(item=>{
            return (
              <Item key={item.id} {...item} updateTodo={updateTodo} deleteTodo={deleteTodo}></Item>
            )
          })
        }
      </ul>
    );
  }
}

export default List;