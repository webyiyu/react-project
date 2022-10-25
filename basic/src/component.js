/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-19 23:13:39
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-25 23:08:09
 * @FilePath: \react-project\basic\src\component.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {findDOM, compareTwoVDom} from './react-dom'
export let updateQueue = {
  isBathingUpdate: false, //是否是批量更新
  updaters: new Set(),
  batchUpdate() {
    updateQueue.isBathingUpdate = false
    for(let updater of updateQueue.updaters){
      updater.updateComponent()
    }
    updateQueue.updaters.clear()
  }
}
class Updater{
  constructor(classInstance) {
    this.classInstance = classInstance
    this.pendingStates = []
    this.callbacks = []
  }
  addState(partialState,callback){
    this.pendingStates.push(partialState)
    if(typeof callback === 'function') {
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }
  emitUpdate() {
    // 判别是否是批量更新
    if(updateQueue.isBathingUpdate) {
      updateQueue.updaters.add(this)
    }else{
      this.updateComponent()
    }
  }
  updateComponent() {
    let {classInstance, pendingStates} = this
    if(pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
    }
  }
  getState() {
    let {classInstance, pendingStates} = this
    let {state} = classInstance
    pendingStates.forEach((nextState)=>{
      if(typeof nextState === 'function') {
        nextState = nextState(state)
      }
      state = {...state, ...nextState}
    })
    pendingStates.length = 0
    return state
  }
}
function shouldUpdate(classInstance, nextState){
  classInstance.state = nextState
  console.log(classInstance, 'CLASS')
  classInstance.forceUpdate()
}
export class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }
  setState(partialState, callback) {
    this.updater.addState(partialState, callback)
  }
  forceUpdate() {
    let oldRenderVDom = this.oldRenderVDom
    let oldDOM = findDOM(oldRenderVDom)
    let newRenderVDom = this.render()
    compareTwoVDom(oldDOM.parentNode, oldRenderVDom, newRenderVDom)
    this.oldRenderVDom = newRenderVDom
  }
}