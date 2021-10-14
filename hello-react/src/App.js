import React, {Component} from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import List from './components/List';

class App extends Component {
  state = {
    todoList : [
      {id: '001', name: 'eat', done: true},
      {id: '002', name: 'sleep', done: false},
      {id: '003', name: 'play', done: false},
    ],
  }

  addTodo = (todoItem)=>{
    const {todoList} = this.state
    const todos = [todoItem, ...todoList]
    this.setState ({
      todoList: todos,
    })
  }

  // 全部清除已完成任务
  clearAll = ()=>{
    const {todoList} = this.state;
    const newTodos = todoList.filter(item => !item.done);
    this.setState({
      todoList: newTodos,
    })
    window.alert('已清除');
  }

  updateTodo = (id, done)=>{
   const {todoList} = this.state;
   const newTodos = todoList.map(item=>{
     if(item.id === id){
      return {...item, done};
     }else{
      return item;
     }
   })
   this.setState({todoList: newTodos})
  }

  // 单独删除任务
  deleteTodo = (id)=>{
    const {todoList} = this.state;
    const newTodos = todoList.filter(item => item.id !== id);
    this.setState({todoList: newTodos})
  }

  // 全选操作
  updateAllTodo = (done)=>{
    const {todoList} = this.state;
    const newTodos = todoList.map(item=> {
      return {...item, done}
    });
    this.setState({todoList: newTodos})
  }

  render() {
    const {todoList} = this.state;
    return (
      <div className="App">
        <Header addTodo={this.addTodo} />
        <List todos={todoList} updateTodo={this.updateTodo} deleteTodo={this.deleteTodo}/>
        <Footer todos={todoList} clearAll={this.clearAll} updateAllTodo={this.updateAllTodo} />
      </div>
    )
  }
}

export default App;
  