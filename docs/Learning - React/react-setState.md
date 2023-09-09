---
sidebar_position: 2
---

# setState原理揭秘

## 类组件中的setState

类组件初始化过程中绑定了负责更新的Updater对象。如果调用setState方法，其实是React底层调用Updater对象上的enqueueSetState方法。

```
/* 绑定setState 方法 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}
```

state的更新机制，从以下两方向分析：
- enqueueSetState到底做了什么
- React底层如何进行批量更新

> react-reconciler/src/ReactFiberClassComponent.js
```
enqueueSetState(){
     /* 每一次调用`setState`，react 都会创建一个 update 里面保存了 */
     const update = createUpdate(expirationTime, suspenseConfig);
     /* callback 可以理解为 setState 回调函数，第二个参数 */
     callback && (update.callback = callback) 
     /* enqueueUpdate 把当前的update 传入当前fiber，待更新队列中 */
     enqueueUpdate(fiber, update); 
     /* 开始调度更新 */
     scheduleUpdateOnFiber(fiber, expirationTime);
}
```
enqueueSetState 作用实际很简单，就是创建一个 update ，然后放入当前 fiber 对象的待更新队列中，最后开启调度更新，进入上述讲到的更新流程。

那么问题来了，React 的 batchUpdate 批量更新是什么时候加上去的呢？

这就要提前聊一下事件系统了。正常 state 更新、UI 交互，都离不开用户的事件，比如点击事件，表单输入等，React 是采用事件合成的形式，每一个事件都是由 React 事件系统统一调度的，那么 State 批量更新正是和事件系统息息相关的。

> react-dom/src/events/DOMLegacyEventPluginSystem.js

```
/* 在`legacy`模式下，所有的事件都将经过此函数同一处理 */
function dispatchEventForLegacyPluginEventSystem(){
    // handleTopLevel 事件处理函数
    batchedEventUpdates(handleTopLevel, bookKeeping);
}
```
重点来了，就是下面这个 batchedEventUpdates 方法。

> react-dom/src/events/ReactDOMUpdateBatching.js

```
function batchedEventUpdates(fn,a){
    /* 开启批量更新  */
   isBatchingEventUpdates = true;
  try {
    /* 这里执行了的事件处理函数， 比如在一次点击事件中触发setState,那么它将在这个函数内执行 */
    return batchedEventUpdatesImpl(fn, a, b);
  } finally {
    /* try 里面 return 不会影响 finally 执行  */
    /* 完成一次事件，批量更新  */
    isBatchingEventUpdates = false;
  }
}
```
如上可以分析出流程，在 React 事件执行之前通过 isBatchingEventUpdates=true 打开开关，开启事件批量更新，当该事件结束，再通过 isBatchingEventUpdates = false; 关闭开关，然后在 scheduleUpdateOnFiber 中根据这个开关来确定是否进行批量更新。

举一个例子，如下组件中这么写：

```
export default class index extends React.Component{
    state = { number:0 }
    handleClick= () => {
          this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback1', this.state.number)  })
          console.log(this.state.number)
          this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback2', this.state.number)  })
          console.log(this.state.number)
          this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback3', this.state.number)  })
          console.log(this.state.number)
    }
    render(){
        return <div>
            { this.state.number }
            <button onClick={ this.handleClick }  >number++</button>
        </div>
    }
} 

```
点击打印：0, 0, 0, callback1 1 ,callback2 1 ,callback3 1

如上代码，在整个 React 上下文执行栈中会变成这样：

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/478aef991b4146c898095b83fe3dc0e7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

那么，为什么异步操作里面的批量更新规则会被打破呢？比如用 promise 或者 setTimeout 在 handleClick 中这么写：

```
setTimeout(()=>{
    this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback1', this.state.number)  })
    console.log(this.state.number)
    this.setState({ number:this.state.number + 1 },()=>{    console.log( 'callback2', this.state.number)  })
    console.log(this.state.number)
    this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback3', this.state.number)  })
    console.log(this.state.number)
})
```
打印 ： callback1 1 , 1, callback2 2 , 2,callback3 3 , 3

那么在整个 React 上下文执行栈中就会变成如下图这样:

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48e730fc687c4ce087e5c0eab2832273~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

所以批量更新规则被打破。

那么，如何在如上异步环境下，继续开启批量更新模式呢？

React-Dom 中提供了批量更新方法 unstable_batchedUpdates，可以去手动批量更新，可以将上述 setTimeout 里面的内容做如下修改:

```
import ReactDOM from 'react-dom'
const { unstable_batchedUpdates } = ReactDOM


setTimeout(()=>{
    unstable_batchedUpdates(()=>{
        this.setState({ number:this.state.number + 1 })
        console.log(this.state.number)
        this.setState({ number:this.state.number + 1})
        console.log(this.state.number)
        this.setState({ number:this.state.number + 1 })
        console.log(this.state.number) 
    })
})
```

打印： 0 , 0 , 0 , callback1 1 , callback2 1 ,callback3 1

在实际工作中，unstable_batchedUpdates 可以用于 Ajax 数据交互之后，合并多次 setState，或者是多次 useState 。原因很简单，所有的数据交互都是在异步环境下，如果没有批量更新处理，一次数据交互多次改变 state 会促使视图多次渲染。

那么如何提升更新优先级呢？

React-dom 提供了`flushSync`，`flushSync`可以将回调函数中的更新任务，放在一个较高的优先级中。React 设定了很多不同优先级的更新任务。如果一次更新任务在 flushSync 回调函数内部，那么将获得一个较高优先级的更新。

接下来，将上述 handleClick 改版如下样子：

```
handerClick=()=>{
    setTimeout(()=>{
        this.setState({ number: 1  })
    })
    this.setState({ number: 2  })
    ReactDOM.flushSync(()=>{
        this.setState({ number: 3  })
    })
    this.setState({ number: 4  })
}
render(){
   console.log(this.state.number)
   return ...
}
```
打印 3 4 1 ，相信不难理解为什么这么打印了。

- 首先 flushSync this.setState({ number: 3 })设定了一个高优先级的更新，所以 2 和 3 被批量更新到 3 ，所以 3 先被打印。
- 更新为 4。
- 最后更新 setTimeout 中的 number = 1。


flushSync补充说明：flushSync 在同步条件下，会合并之前的 setState | useState，可以理解成，如果发现了 flushSync ，就会先执行更新，如果之前有未更新的 setState ｜ useState ，就会一起合并了，所以就解释了如上，2 和 3 被批量更新到 3 ，所以 3 先被打印。


综上所述， React 同一级别更新优先级关系是:

flushSync 中的 setState > 正常执行上下文中 setState > setTimeout ，Promise 中的 setState。

## 函数组件中的setState

useState用法
```
 [ ①state , ②dispatch ] = useState(③initData)
```
- ① state，目的提供给 UI ，作为渲染视图的数据源。
- ② dispatch 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。
- ③ initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。

initData 为非函数的情况:

```
/* 此时将把 0 作为初使值 */
const [ number , setNumber ] = React.useState(0)
```

initData 为函数的情况:

```
 const [ number , setNumber ] = React.useState(()=>{
       /*  props 中 a = 1 state 为 0-1 随机数 ， a = 2 state 为 1 -10随机数 ， 否则，state 为 1 - 100 随机数   */
       if(props.a === 1) return Math.random() 
       if(props.a === 2) return Math.ceil(Math.random() * 10 )
       return Math.ceil(Math.random() * 100 ) 
    })
```

对于 dispatch的参数,也有两种情况：

第一种非函数情况，此时将作为新的值，赋予给 state，作为下一次渲染使用;

第二种是函数的情况，如果 dispatch 的参数为一个函数，这里可以称它为reducer，reducer 参数，是上一次返回最新的 state，返回值作为新的 state。

dispatch 参数是一个非函数值

```
const [ number , setNumber ] = React.useState(0)
/* 一个点击事件 */
const handleClick=()=>{
   setNumber(1)
   setNumber(2)
   setNumber(3)
}
```

dispatch 参数是一个函数

```
const [ number , setNumber ] = React.useState(0)
const handleClick=()=>{
   setNumber((state)=> state + 1)  // state - > 0 + 1 = 1
   setNumber(8)  // state - > 8
   setNumber((state)=> state + 1)  // state - > 8 + 1 = 9
}
```

如何监听 state 变化？

类组件 setState 中，有第二个参数 callback 或者是生命周期componentDidUpdate 可以检测监听到 state 改变或是组件更新。

那么在函数组件中，如何怎么监听 state 变化呢？这个时候就需要 useEffect 出场了，通常可以把 state 作为依赖项传入 useEffect 第二个参数 deps ，但是注意 useEffect 初始化会默认执行一次。

```
export default function Index(props){
    const [ number , setNumber ] = React.useState(0)
    /* 监听 number 变化 */
    React.useEffect(()=>{
        console.log('监听number变化，此时的number是:  ' + number )
    },[ number ])
    const handerClick = ()=>{
        /** 高优先级更新 **/
        ReactDOM.flushSync(()=>{
            setNumber(2) 
        })
        /* 批量更新 */
        setNumber(1) 
        /* 滞后更新 ，批量更新规则被打破 */
        setTimeout(()=>{
            setNumber(3) 
        })
       
    }
    console.log(number)
    return <div>
        <span> { number }</span>
        <button onClick={ handerClick }  >number++</button>
    </div>
}
```

dispatch更新特点

上述讲的批量更新和 flushSync ，在函数组件中，dispatch 更新效果和类组件是一样的，但是 useState 有一点值得注意，就是当调用改变 state 的函数dispatch，在本次函数执行上下文中，是获取不到最新的 state 值的，把上述demo 如下这么改：

```
const [ number , setNumber ] = React.useState(0)
const handleClick = ()=>{
    ReactDOM.flushSync(()=>{
        setNumber(2) 
        console.log(number) 
    })
    setNumber(1) 
    console.log(number)
    setTimeout(()=>{
        setNumber(3) 
        console.log(number)
    })   
}
```
原因很简单，`函数组件更新就是函数的执行`，在函数一次执行过程中，函数内部所有变量重新声明，所以改变的 state ，只有在下一次函数组件执行时才会被更新。所以在如上同一个函数执行上下文中，number 一直为0，无论怎么打印，都拿不到最新的 state 。

useState注意事项

在使用 useState 的 dispatchAction 更新 state 的时候，记得不要传入相同的 state，这样会使视图不更新。比如下面这么写：

```
export default function Index(){
    const [ state  , dispatchState ] = useState({ name:'alien' })
    const  handleClick = ()=>{ // 点击按钮，视图没有更新。
        state.name = 'Alien'
        dispatchState(state) // 直接改变 `state`，在内存中指向的地址相同。
    }
    return <div>
         <span> { state.name }</span>
        <button onClick={ handleClick }  >changeName++</button>
    </div>
}
```
如上例子🌰中，当点击按钮后，发现视图没有改变，为什么会造成这个原因呢？

在 useState 的 dispatchAction 处理逻辑中，会浅比较两次 state ，发现 state 相同，不会开启更新调度任务； demo 中两次 state 指向了相同的内存空间，所以默认为 state 相等，就不会发生视图更新了。

解决问题： 把上述的 dispatchState 改成 dispatchState({...state}) 根本解决了问题，浅拷贝了对象，重新申请了一个内存空间。

useState原理揭秘
对于 useState 原理，后面会有独立的篇章介绍，这里就不多说了。

---

类组件中的 setState 和函数组件中的 useState 有什么异同？ 

相同点:

- 首先从原理角度出发，setState和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则。

不同点:

- 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。
(hooks方式中，会决定是否更新组件)

- setState 有专门监听 state 变化的回调函数 callback，可以获取最新state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。

- setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。

## 总结
从本章节学到了哪些知识：

1. setState用法详解，底层更新流程。
2. useState用法详解，注意事项。
3. 几种不同优先级的更新任务
