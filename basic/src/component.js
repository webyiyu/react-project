/*
 * @Author: hySmart 906325802@qq.com
 * @Date: 2022-10-19 23:13:39
 * @LastEditors: hySmart 906325802@qq.com
 * @LastEditTime: 2022-10-25 23:29:47
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
  emitUpdate(nextProps) {
    // 判别是否是批量更新
    this.nextProps = nextProps
    if(updateQueue.isBathingUpdate) {
      updateQueue.updaters.add(this)
    }else{
      this.updateComponent()
    }
  }
  updateComponent() {
    let {classInstance, pendingStates} = this
    if(this.nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, this.nextProps,this.getState())
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
function shouldUpdate(classInstance, nextProps, nextState){
  // shouldComponentUpdate钩子需要reture一个布尔值，如果无返回会报错，
  // 如果返回了false 则不进行后续更新
  let willUpdate = true
  if(classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
    willUpdate = false
  }
  if(willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }
  if(nextProps) {
    classInstance.props = nextProps
  }
  classInstance.state = nextState
  if(willUpdate) {
    classInstance.forceUpdate()
  }
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
    if(this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state)
    }
  }
}